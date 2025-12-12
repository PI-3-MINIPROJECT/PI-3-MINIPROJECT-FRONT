import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import './ChatRoom.scss';

interface ChatRoomProps {
  meetingId: string;
  userId: string;
  username: string;
  onClose?: () => void;
}

/**
 * ChatRoom component for real-time messaging
 * @param {ChatRoomProps} props - Component props
 * @returns {JSX.Element} ChatRoom component
 */
const ChatRoom: React.FC<ChatRoomProps> = ({ meetingId, userId, username, onClose }) => {
  const [messageInput, setMessageInput] = useState('');
  const [reconnecting, setReconnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isConnected,
    onlineUsers,
    messages,
    isTyping,
    connectionError,
    sendMessage,
    startTyping,
    stopTyping,
    participantCount
  } = useChat(meetingId, userId, username);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Monitor connection status for reconnection feedback (Heuristic 9)
  useEffect(() => {
    if (!isConnected && !connectionError) {
      setReconnecting(true);
    } else {
      setReconnecting(false);
    }
  }, [isConnected, connectionError]);

  /**
   * Handles sending a chat message
   * @param {React.FormEvent} e - Form submit event
   * @returns {void}
   */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
      stopTyping();
    }
  };

  /**
   * Handles input change and typing indicators
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   * @returns {void}
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  /**
   * Formats timestamp for display
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted time string (HH:mm)
   */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-room" role="region" aria-label="Sala de chat">
      <div className="chat-header">
        <div className="chat-title">
          <h3>Conversación</h3>
          <span 
            className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}
            role="status"
            aria-live="polite"
            aria-label={isConnected ? 'Conectado al chat' : 'Desconectado del chat'}
          >
            {isConnected ? '🟢' : '🔴'}
          </span>
        </div>
        <div className="chat-header-right">
          <div 
            className="participants-count"
            role="status"
            aria-live="polite"
            aria-label={`${participantCount} ${participantCount === 1 ? 'persona conectada' : 'personas conectadas'}`}
          >
            👥 {participantCount} {participantCount === 1 ? 'persona' : 'personas'}
          </div>
          {onClose && (
            <button
              type="button"
              className="chat-close-button"
              onClick={onClose}
              aria-label="Cerrar chat"
              title="Cerrar chat"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Reconnection notification (Heuristic 9) */}
      {reconnecting && !connectionError && (
        <div className="chat-reconnecting" role="status" aria-live="polite">
          🔄 Intentando reconectar al chat...
        </div>
      )}

      {connectionError && (
        <div className="connection-error" role="alert" aria-live="assertive">
          ⚠️ No pudimos conectarte al chat. {connectionError}
          <button 
            className="connection-error__retry"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      )}

      {onlineUsers.length > 0 && (
        <div className="online-users">
          <div className="online-users-list">
            {onlineUsers.map(user => (
              <div key={user.userId} className="online-user">
                <span className="user-indicator">🟢</span>
                <span className={user.userId === userId ? 'current-user' : ''}>
                  {user.username} {user.userId === userId && '(tú)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages" role="status">
            <p>💬 Conversación vacía</p>
            <p>¡Sé el primero en saludar!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={msg.messageId || index}
                className={`message ${msg.userId === userId ? 'own-message' : 'other-message'}`}
              >
                <div className="message-header">
                  <span className="message-username">
                    {msg.userId === userId ? 'Tú' : msg.username}
                  </span>
                  <span className="message-time">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="message-content">
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}

        {isTyping.length > 0 && (
          <div className="typing-indicator">
            <span className="typing-dots">
              {isTyping.map(user => user.username).join(', ')} {isTyping.length === 1 ? 'está' : 'están'} escribiendo
              <span className="dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </span>
          </div>
        )}
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder={isConnected ? "Escribe tu mensaje aquí..." : "Conectando al chat..."}
          value={messageInput}
          onChange={handleInputChange}
          disabled={!isConnected}
          maxLength={500}
          aria-label="Escribe tu mensaje"
        />
        <button
          type="submit"
          className="send-button"
          disabled={!isConnected || !messageInput.trim()}
          aria-label="Enviar tu mensaje"
          title="📤 Enviar mensaje"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
