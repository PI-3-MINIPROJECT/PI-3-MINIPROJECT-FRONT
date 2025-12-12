import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_CHAT_SERVER_URL || (import.meta.env.PROD ? '' : 'http://localhost:4000');

/**
 * Socket service for managing WebSocket connections
 * Singleton pattern to ensure only one connection exists
 * Implements automatic reconnection with user feedback (Heuristic 9)
 */
class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectionCallbacks: ((status: 'attempting' | 'success' | 'failed') => void)[] = [];

  /**
   * Register callback for reconnection status updates
   * @param {Function} callback - Callback function
   */
  onReconnectionStatus(callback: (status: 'attempting' | 'success' | 'failed') => void): void {
    this.reconnectionCallbacks.push(callback);
  }

  /**
   * Notify all callbacks about reconnection status
   * @param {string} status - Reconnection status
   */
  private notifyReconnectionStatus(status: 'attempting' | 'success' | 'failed'): void {
    this.reconnectionCallbacks.forEach(callback => callback(status));
  }

  /**
   * Connect to the socket server with automatic reconnection
   * @returns {Socket} Socket instance
   */
  connect(): Socket {
    if (!SOCKET_URL) {
      throw new Error('VITE_CHAT_SERVER_URL no está configurada. Por favor, configura esta variable de entorno.');
    }
    
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
      this.reconnectAttempts = 0;
      this.notifyReconnectionStatus('success');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket desconectado:', reason);
      this.isConnecting = false;
      
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error.message);
      this.isConnecting = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        console.log(`🔄 Intento de reconexión ${this.reconnectAttempts} de ${this.maxReconnectAttempts}`);
        this.notifyReconnectionStatus('attempting');
      } else {
        console.error('❌ Máximo de intentos de reconexión alcanzado');
        this.notifyReconnectionStatus('failed');
      }
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Intentando reconectar... (intento ${attemptNumber})`);
      this.notifyReconnectionStatus('attempting');
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconexión exitosa después de ${attemptNumber} intentos`);
      this.reconnectAttempts = 0;
      this.notifyReconnectionStatus('success');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Fallo al reconectar después de múltiples intentos');
      this.notifyReconnectionStatus('failed');
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
