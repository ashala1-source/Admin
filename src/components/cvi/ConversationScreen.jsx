import React from 'react';
import { Conversation } from './components/conversation';
import ChatInterface from './ChatInterface';

const ISIO_GREEN = '#00BA8D';
const ISIO_WHITE = '#FFFFFF';

export default function ConversationScreen({
  backgroundImage,
  conversationUrl,
  chatOpen,
  setChatOpen,
  onLeave
}) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `url('${backgroundImage}') center center / cover no-repeat`
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '90vh',
          width: '90vw',
          maxWidth: '1400px',
          background: ISIO_WHITE,
          borderRadius: '18px',
          boxShadow: '0 2px 16px rgba(0,186,141,0.08)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Video area */}
        <div
          style={{
            flex: chatOpen ? 2 : 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: 0
          }}
        >
          <div
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              display: 'flex'
            }}
          >
            <Conversation
              conversationUrl={conversationUrl}
              onLeave={onLeave}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>

        {/* Chat panel */}
        <div
          style={{
            flex: 1,
            minWidth: '350px',
            maxWidth: '500px',
            display: chatOpen ? 'flex' : 'none',
            flexDirection: 'column',
            background: '#F7F9F8',
            borderRadius: '0 18px 18px 0',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: ISIO_GREEN,
              color: ISIO_WHITE,
              fontWeight: 700,
              fontSize: '1rem',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Assistant — AI Onboarding</span>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: ISIO_WHITE,
                fontSize: '1.2rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          {/* Chat Interface */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
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
              boxShadow: '0 2px 12px rgba(0,186,141,0.18)',
              cursor: 'pointer'
            }}
          >
            💬
          </button>
        )}
      </div>
    </div>
  );
}