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
    <div className="chat-room">
      <div className="chat-header">
        <div className="chat-title">
          <h3>Chat</h3>
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </span>
        </div>
        <div className="chat-header-right">
          <div className="participants-count">
            👥 {participantCount} {participantCount === 1 ? 'participante' : 'participantes'}
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

      {connectionError && (
        <div className="connection-error">
          ⚠️ Error: {connectionError}
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
          <div className="no-messages">
            <p>No hay mensajes aún</p>
            <p>¡Sé el primero en escribir!</p>
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
          placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
          value={messageInput}
          onChange={handleInputChange}
          disabled={!isConnected}
          maxLength={500}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!isConnected || !messageInput.trim()}
          aria-label="Enviar mensaje"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
