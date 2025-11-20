import React, { useState, useEffect, useRef } from 'react';
import { useDaily, useDailyEvent } from '@daily-co/daily-react';

const ISIO_GREEN = '#00BA8D';
const ISIO_WHITE = '#FFFFFF';
const ISIO_BLACK = '#000000';
const ISIO_CORAL = '#E76152';

function ChatInterface() {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const callObject = useDaily();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useDailyEvent('app-message', (event) => {
    const { data } = event;
    if (data?.conversation_id && !conversationId) {
      setConversationId(data.conversation_id);
    }
    if (data?.event_type === 'conversation.utterance') {
      const utterance = data.properties;
      const sender = utterance.speaker || utterance.role;
      let text = utterance.utteranceText || utterance.speech;

      if (text) {
        text = text.replace(/\bIssio\b/g, 'Isio');
      }

      if (sender && text) {
        const lastUserMessage = chatMessages
          .slice()
          .reverse()
          .find(msg => msg.sender === 'user');
        const isDuplicate = lastUserMessage?.text?.trim() === text.trim();
        if (!isDuplicate) {
          setChatMessages(prev => [...prev, {
            sender,
            text,
            timestamp: new Date()
          }]);
        }
        setIsTyping(false);
      }
    }
    if (data?.event_type === 'conversation.replica.started_speaking') {
      setIsTyping(true);
    }
    if (data?.event_type === 'conversation.replica.stopped_speaking') {
      setIsTyping(false);
    }
  });

  const sendTextMessage = (userMessage) => {
    if (!callObject || !userMessage.trim() || !conversationId) return;
    const payload = {
      event_type: 'conversation.respond',
      message_type: 'conversation',
      conversation_id: conversationId,
      properties: {
        text: userMessage
      }
    };
    callObject.sendAppMessage(payload);
    setChatMessages(prev => [...prev, {
      sender: 'user',
      text: userMessage,
      timestamp: new Date()
    }]);
    setInputText('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendTextMessage(inputText);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#F7F9F8'
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                backgroundColor: msg.sender === 'user' ? ISIO_GREEN : '#E9ECEB',
                color: msg.sender === 'user' ? ISIO_WHITE : ISIO_BLACK,
                padding: '12px 16px',
                borderRadius: '16px',
                maxWidth: '75%',
                fontSize: '0.95rem',
                lineHeight: '1.4',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              {msg.text}
              <div style={{
                fontSize: '12px',
                marginTop: '6px',
                textAlign: 'right',
                color: ISIO_CORAL
              }}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ fontStyle: 'italic', color: ISIO_GREEN }}>
            Charlie is speaking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          padding: '12px',
          background: ISIO_WHITE
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            borderRadius: '12px',
            border: `1px solid ${ISIO_GREEN}`,
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: '12px',
            padding: '12px 24px',
            background: ISIO_GREEN,
            color: ISIO_WHITE,
            border: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;
