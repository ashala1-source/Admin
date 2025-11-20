import React, { useState } from 'react';
import { CVIProvider } from './components/cvi-provider';
import SelectionScreen from './SelectionScreen';
import ConversationScreen from './ConversationScreen';
import FeedbackButton from './FeedbackButton';
// Optional: shared variables/resets

const ISIO_BG_IMAGE = '/backgroundisio.png';
const PERSONA_ID = 'pa5ef1a85900';
const REPLICA_MALE_ID = 'rf4703150052';
const REPLICA_FEMALE_ID = 'r9d30b0e55ac';

function App() {
  const [conversationUrl, setConversationUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedReplicaId, setSelectedReplicaId] = useState(null);

  const startConversation = async () => {
    if (!selectedReplicaId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://tavusapi.com/v2/conversations', {
        method: 'POST',
        headers: {
          'x-api-key': 'fa999107b41342fa8bc5255cc8c9dfe6',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          replica_id: selectedReplicaId,
          persona_id: PERSONA_ID,
          custom_greeting: "Hi, I’m your Issio Pension Assistant. I’m here to make things simple — whether you want to retire, update your details, or check your payments. Just ask, and I’ll guide you through it step by step."
        })
      });
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

  return (
    <CVIProvider>
      <FeedbackButton />
      {!conversationUrl ? (
        <SelectionScreen
          backgroundImage={ISIO_BG_IMAGE}
          loading={loading}
          error={error}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          setSelectedReplicaId={setSelectedReplicaId}
          startConversation={startConversation}
          REPLICA_MALE_ID={REPLICA_MALE_ID}
          REPLICA_FEMALE_ID={REPLICA_FEMALE_ID}
        />
      ) : (
        <ConversationScreen
          backgroundImage={ISIO_BG_IMAGE}
          conversationUrl={conversationUrl}
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          onLeave={handleLeave}
        />
      )}
    </CVIProvider>
  );
}

export default App;