import React, { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startConversation = async () => {
    setLoading(true);
    setError(null);

    const url = 'https://tavusapi.com/v2/conversations';
    const options = {
      method: 'POST',
      headers: {
        'x-api-key': 'fa999107b41342fa8bc5255cc8c9dfe6',
        'Content-Type': 'application/json'
      },
      body: '{"replica_id":"rf4703150052","persona_id":"pa6975faa9dc"}'
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok && data.conversation_url) {
        window.location.href = data.conversation_url;
      } else {
        throw new Error(data.message || 'Failed to create conversation.');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Start a Tavus Conversation</h1>
      <button onClick={startConversation} disabled={loading}>
        {loading ? 'Starting...' : 'Start Conversation'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
