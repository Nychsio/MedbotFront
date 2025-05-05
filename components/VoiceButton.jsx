// src/components/VoiceButton.jsx
import React from 'react';

/**
 * Komponent przycisku mikrofonu do obsługi rozpoznawania mowy
 * @param {Object} props - Właściwości komponentu
 * @param {boolean} props.isListening - Czy nasłuchiwanie jest aktywne
 * @param {boolean} props.isDisabled - Czy przycisk jest wyłączony
 * @param {function} props.onClick - Funkcja wywoływana po kliknięciu przycisku
 * @returns {JSX.Element} - Element przycisku mikrofonu
 */
const VoiceButton = ({ isListening, isDisabled, onClick }) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`chat-mic-button ${isListening ? 'chat-mic-active' : ''}`}
      aria-label={isListening ? "Zatrzymaj nagrywanie" : "Zacznij nagrywać"}
      disabled={isDisabled}
    >
      <span className="mic-icon">🎤</span>
      {isListening && <span className="listening-indicator">Słucham...</span>}
    </button>
  );
};

export default VoiceButton;