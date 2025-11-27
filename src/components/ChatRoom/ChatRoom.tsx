import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import './ChatRoom.scss';

interface ChatRoomProps {
  meetingId: string;
  userId: string;
  username: string;
}

/**
 * ChatRoom component for real-time messaging
 * @param {ChatRoomProps} props - Component props
 * @returns {JSX.Element} ChatRoom component
 */
const ChatRoom: React.FC<ChatRoomProps> = ({ meetingId, userId, username }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook personalizado para chat
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

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejar envío de mensaje
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
      stopTyping();
    }
  };

  // Manejar cambio de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  // Formatear hora
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-room">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-title">
          <h3>Chat</h3>
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </span>
        </div>
        <div className="participants-count">
          👥 {participantCount} {participantCount === 1 ? 'participante' : 'participantes'}
        </div>
      </div>

      {/* Error de conexión */}
      {connectionError && (
        <div className="connection-error">
          ⚠️ Error: {connectionError}
        </div>
      )}

      {/* Lista de usuarios online */}
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

      {/* Mensajes */}
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

        {/* Indicador de escritura */}
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

      {/* Input de mensaje */}
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
