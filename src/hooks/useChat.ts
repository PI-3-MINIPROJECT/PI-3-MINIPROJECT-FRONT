import { useEffect, useState, useCallback, useRef } from 'react';
import socketService from '../services/socketService';
import type { Socket } from 'socket.io-client';

interface ChatMessage {
  messageId: string;
  meetingId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

interface OnlineUser {
  userId: string;
  username: string;
  joinedAt: string;
}

interface TypingUser {
  userId: string;
  username: string;
}

interface UseChatReturn {
  isConnected: boolean;
  onlineUsers: OnlineUser[];
  messages: ChatMessage[];
  isTyping: TypingUser[];
  connectionError: string | null;
  sendMessage: (messageText: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  participantCount: number;
}

/**
 * Custom hook for managing chat functionality with WebSocket
 * @param {string} meetingId - Meeting ID
 * @param {string} userId - User ID
 * @param {string} username - Username
 * @returns {UseChatReturn} Chat state and functions
 */
export const useChat = (
  meetingId: string | undefined,
  userId: string | undefined,
  username: string | undefined
): UseChatReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<TypingUser[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const joinMeeting = useCallback(() => {
    if (socketRef.current?.connected && meetingId && userId && username) {
      console.log('🔄 Uniéndose a la reunión:', meetingId);
      
      socketRef.current.emit('join:meeting', {
        meetingId,
        userId,
        username
      });
    }
  }, [meetingId, userId, username]);

  const sendMessage = useCallback((messageText: string) => {
    if (!messageText.trim()) return;
    
    if (socketRef.current?.connected && meetingId && userId && username) {
      console.log('📤 Enviando mensaje:', messageText);
      
      socketRef.current.emit('chat:message', {
        meetingId,
        userId,
        username,
        message: messageText.trim()
      });
    } else {
      console.error('❌ No se puede enviar mensaje: Socket desconectado');
    }
  }, [meetingId, userId, username]);

  const startTypingBase = useCallback(() => {
    if (socketRef.current?.connected && meetingId && userId && username) {
      socketRef.current.emit('typing:start', {
        meetingId,
        userId,
        username
      });
    }
  }, [meetingId, userId, username]);

  const stopTypingBase = useCallback(() => {
    if (socketRef.current?.connected && meetingId && userId && username) {
      socketRef.current.emit('typing:stop', {
        meetingId,
        userId,
        username
      });
    }
  }, [meetingId, userId, username]);

  const handleTyping = useCallback(() => {
    startTypingBase();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTypingBase();
    }, 1000);
  }, [startTypingBase, stopTypingBase]);

  useEffect(() => {
    if (!meetingId || !userId || !username) {
      console.warn('⚠️ Faltan datos para conectar al chat');
      return;
    }

    const socket = socketService.connect();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('✅ Conectado al chat');
      setIsConnected(true);
      setConnectionError(null);
      joinMeeting();
    };

    const handleDisconnect = (reason: string) => {
      console.log('❌ Desconectado del chat:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error('❌ Error de conexión:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    };

    const handleUsersOnline = (data: { participants: OnlineUser[] }) => {
      console.log('👥 Usuarios online:', data.participants.length);
      setOnlineUsers(data.participants || []);
    };

    const handleNewMessage = (message: ChatMessage) => {
      console.log('💬 Nuevo mensaje de:', message.username);
      setMessages(prev => [...prev, message]);
    };

    const handleUserJoined = (data: { userId: string; username: string }) => {
      console.log('👋 Usuario se unió:', data.username);
    };

    const handleUserLeft = (data: { userId: string; username: string }) => {
      console.log('👋 Usuario se fue:', data.username);
    };

    const handleTypingStart = (data: TypingUser) => {
      setIsTyping(prev => {
        if (!prev.find(user => user.userId === data.userId)) {
          return [...prev, data];
        }
        return prev;
      });
    };

    const handleTypingStop = (data: TypingUser) => {
      setIsTyping(prev => prev.filter(user => user.userId !== data.userId));
    };

    const handleError = (error: { message: string }) => {
      console.error('❌ Error del socket:', error);
      setConnectionError(error.message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('users:online', handleUsersOnline);
    socket.on('chat:message', handleNewMessage);
    socket.on('user:joined', handleUserJoined);
    socket.on('user:left', handleUserLeft);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('error', handleError);

    return () => {
      console.log('🧹 Limpiando conexión de chat');
      
      if (socket.connected) {
        socket.emit('leave:meeting', meetingId);
      }

      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('users:online', handleUsersOnline);
      socket.off('chat:message', handleNewMessage);
      socket.off('user:joined', handleUserJoined);
      socket.off('user:left', handleUserLeft);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('error', handleError);

      socketService.disconnect();
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [meetingId, userId, username, joinMeeting]);

  return {
    isConnected,
    onlineUsers,
    messages,
    isTyping,
    connectionError,
    sendMessage,
    startTyping: handleTyping,
    stopTyping: stopTypingBase,
    participantCount: onlineUsers.length
  };
};
