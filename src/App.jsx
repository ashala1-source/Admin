// App.jsx
import React, { useState } from 'react';
import { CVIProvider } from './components/cvi/cvi/components/cvi-provider';
import { Conversation } from './components/cvi/cvi/components/conversation';
import ChatInterface from './components/cvi/ChatInterface';
import './App.css'; // ⬅️ new stylesheet for polished UI

const ISIO_GREEN = '#00BA8D';
const ISIO_WHITE = '#FFFFFF';
const ISIO_BLACK = '#000000';
const ISIO_BG_IMAGE = '/backgroundisio.png';

// Replica IDs (update the female ID to your real replica)
const REPLICA_MALE_ID = 'rf4703150052';
const REPLICA_FEMALE_ID = 'rfREPLACE_WITH_FEMALE_ID';

// Persona ID (unchanged)
const PERSONA_ID = 'pbee43829900';

// Local avatar images (place files in /public or use your own URLs)
const MALE_AVATAR = '/maleavatar.png';    // e.g. /public/male-avatar.png
const FEMALE_AVATAR = '/femaleavatar.png';// e.g. /public/female-avatar.png

function App() {
  const [conversationUrl, setConversationUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);

  // NEW: selection state
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedReplicaId, setSelectedReplicaId] = useState(null);

  const handleSelect = (gender) => {
    setSelectedGender(gender);
    setSelectedReplicaId(gender === 'male' ? REPLICA_MALE_ID : REPLICA_FEMALE_ID);
  };

  const startConversation = async () => {
    if (!selectedReplicaId) return;
    setLoading(true);
    setError(null);

    const url = 'https://tavusapi.com/v2/conversations';
    const options = {
      method: 'POST',
      headers: {
        'x-api-key': 'fa999107b41342fa8bc5255cc8c9dfe6',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        replica_id: selectedReplicaId,
        persona_id: PERSONA_ID,
        custom_greeting:
          "Hi, I'm your virtual onboarding assistant at Isio. How can I help you today?"
      })
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok && data.conversation_url) {
        setConversationUrl(data.conversation_url);
      } else {
        throw new Error(data.message || 'Failed to create conversation.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    setConversationUrl(null);
    setChatOpen(true);
    setSelectedGender(null);
    setSelectedReplicaId(null);
    setError(null);
  };

  const handleFeedbackClick = () => {
    const FEEDBACK_URL = 'https://forms.office.com/e/ysTHxSsYgW';
    window.open(FEEDBACK_URL, '_blank', 'noopener,noreferrer');
  };

  const FeedbackButton = () => (
    <button
      onClick={handleFeedbackClick}
      className="feedback-button"
      aria-label="Provide Feedback"
      title="Provide Feedback"
    >
      <span role="img" aria-hidden="true">📝</span>
      Provide Feedback
    </button>
  );

  return (
    <CVIProvider>
      <FeedbackButton />

      {!conversationUrl ? (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `url('${ISIO_BG_IMAGE}') center center / cover no-repeat, ${ISIO_GREEN}`
          }}
        >
          {/* CENTER SELECTION CARD */}
          <div className="selector-card" role="dialog" aria-labelledby="selector-title">
            <h1 id="selector-title" className="selector-title">
              Start a conversation
            </h1>

            <div className="selector-row">
              {/* Male option */}
              <button
                className={`selector-option ${selectedGender === 'male' ? 'selected' : ''}`}
                onClick={() => handleSelect('male')}
                aria-pressed={selectedGender === 'male'}
                aria-label="Choose male assistant"
              >
                <span className="avatar">
                  <img src={MALE_AVATAR} alt="" />
                </span>
                <span className="option-label">Male</span>
              </button>

              {/* Female option */}
              <button
                className={`selector-option ${selectedGender === 'female' ? 'selected' : ''}`}
                onClick={() => handleSelect('female')}
                aria-pressed={selectedGender === 'female'}
                aria-label="Choose female assistant"
              >
                <span className="avatar">
                  <img src={FEMALE_AVATAR} alt="" />
                </span>
                <span className="option-label">Female</span>
              </button>
            </div>

            {/* CTA */}
            <button
              className={`cta ${!selectedReplicaId ? 'cta-disabled' : ''}`}
              onClick={startConversation}
              disabled={!selectedReplicaId || loading}
              aria-disabled={!selectedReplicaId || loading}
            >
              {loading ? 'Starting…' : (selectedGender ? `Start with ${selectedGender}` : 'Select an assistant')}
            </button>

            {error && <p className="error">{error}</p>}
          </div>
        </div>
      ) : (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            margin: 0,
            padding: 0,
            background: `url('${ISIO_BG_IMAGE}') center center / cover no-repeat, ${ISIO_GREEN}`,
            fontFamily: 'Arial, Trebuchet MS, sans-serif',
            color: ISIO_BLACK,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            display: 'flex',
            height: '90vh',
            width: '90vw',
            maxWidth: '1400px',
            background: ISIO_WHITE,
            borderRadius: '18px',
            boxShadow: '0 2px 16px rgba(0,186,141,0.08)',
            overflow: 'hidden',
          }}>
            {/* Conversation area */}
            <div style={{
              flex: chatOpen ? 2 : 1,
              minWidth: 0,
              transition: 'flex 0.3s',
              background: 'transparent',
              borderRadius: chatOpen ? '18px 0 0 18px' : '18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              <div style={{ flex: 1, display: 'flex', minHeight: 0, height: '100%' }}>
                <Conversation
                  conversationUrl={conversationUrl}
                  onLeave={handleLeave}
                />
              </div>
            </div>

            {/* Chat panel */}
            <div style={{
              flex: 1,
              minWidth: '350px',
              maxWidth: '500px',
              background: 'transparent',
              borderRadius: '0 18px 18px 0',
              display: chatOpen ? 'flex' : 'none',
              flexDirection: 'column',
              height: '100%',
              minHeight: 0,
              transition: 'flex 0.3s',
              position: 'relative',
              zIndex: 2,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '10px 16px',
                borderBottom: `1px solid ${ISIO_GREEN}`,
              }}>
                <button
                  onClick={() => setChatOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: ISIO_GREEN,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    padding: '4px 8px',
                  }}
                  aria-label="Close Chat"
                >
                  × Close
                </button>
              </div>
              <div style={{ flex: 1, minHeight: 0, height: '100%' }}>
                <ChatInterface conversationUrl={conversationUrl} />
              </div>
            </div>

            {!chatOpen && (
              <button
                onClick={() => setChatOpen(true)}
                style={{
                  position: 'absolute',
                  right: '32px',
                  bottom: '32px',
                  background: ISIO_WHITE,
                  color: ISIO_GREEN,
                  border: 'none',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  fontSize: '2rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 12px rgba(0,186,141,0.18)',
                  cursor: 'pointer',
                  zIndex: 101,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                aria-label="Open Chat"
                title="Open Chat"
              >
                💬
              </button>
            )}
          </div>
        </div>
      )}
    </CVIProvider>
  );
}

export default App;