import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:4000';

/**
 * Socket service for managing WebSocket connections
 * Singleton pattern to ensure only one connection exists
 */
class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;

  /**
   * Connect to the socket server
   * @returns {Socket} Socket instance
   */
  connect(): Socket {
    if (this.socket?.connected || this.isConnecting) {
      return this.socket!;
    }

    this.isConnecting = true;
    
    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado:', reason);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error.message);
      this.isConnecting = false;
    });

    return this.socket;
  }

  /**
   * Disconnect from the socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  /**
   * Get the current socket instance
   * @returns {Socket | null} Socket instance or null
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Emit an event with data if socket is connected
   * @param {string} event - Event name
   * @param {unknown} data - Data to send
   */
  emit(event: string, data: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket no conectado, no se puede enviar:', event);
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
