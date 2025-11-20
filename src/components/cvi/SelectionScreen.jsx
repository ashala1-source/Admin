import React from 'react';
import './SelectionScreen.css';

const MALE_AVATAR = '/maleavatar.png';
const FEMALE_AVATAR = '/femaleavatar.png';

export default function SelectionScreen({
  backgroundImage,
  loading,
  error,
  selectedGender,
  setSelectedGender,
  setSelectedReplicaId,
  startConversation,
  REPLICA_MALE_ID,
  REPLICA_FEMALE_ID
}) {
  const handleSelect = (gender) => {
    setSelectedGender(gender);
    setSelectedReplicaId(gender === 'male' ? REPLICA_MALE_ID : REPLICA_FEMALE_ID);
  };

  return (
    <div
      className="selection-screen"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="selector-card" role="dialog" aria-labelledby="selector-title">
        <h1 id="selector-title" className="selector-title">Start a conversation</h1>

        <div className="selector-row">
          <button
            className={`selector-option ${selectedGender === 'male' ? 'selected' : ''}`}
            onClick={() => handleSelect('male')}
            aria-pressed={selectedGender === 'male'}
          >
            <span className="avatar"><img src={MALE_AVATAR} alt="" /></span>
            <span className="option-label">Male</span>
          </button>

          <button
            className={`selector-option ${selectedGender === 'female' ? 'selected' : ''}`}
            onClick={() => handleSelect('female')}
            aria-pressed={selectedGender === 'female'}
          >
            <span className="avatar"><img src={FEMALE_AVATAR} alt="" /></span>
            <span className="option-label">Female</span>
          </button>
        </div>

        <button
          className={`cta ${!selectedGender ? 'cta-disabled' : ''}`}
          onClick={startConversation}
          disabled={!selectedGender || loading}
        >
          {loading ? 'Starting…' : selectedGender ? `Start with ${selectedGender}` : 'Select an assistant'}
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}