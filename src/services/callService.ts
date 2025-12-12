/**
 * Call Service for managing voice call WebSocket connections
 * @module services/callService
 * @description Handles Socket.IO connection to BACK-CALL server for voice signaling
 */

import { io, Socket } from 'socket.io-client';

/**
 * Get voice call server URL from environment variables
 * @returns {string} Server URL
 * @throws {Error} If URL is not configured in production
 */
const getCallServerUrl = (): string => {
  const url = import.meta.env.VITE_CALL_SERVER_URL;
  
  if (import.meta.env.PROD) {
    if (!url || url.trim() === '') {
      throw new Error('VITE_CALL_SERVER_URL is not configured in production. Please set this environment variable in Vercel.');
    }
    return url;
  }
  
  return url || 'http://localhost:5000';
};

const CALL_SERVER_URL = getCallServerUrl();

/**
 * ICE Server configuration for WebRTC
 * @interface IceServer
 */
export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

/**
 * Call participant information
 * @interface CallParticipant
 */
export interface CallParticipant {
  userId: string;
  peerId: string;
  username: string;
  isMuted: boolean;
  isVideoOn: boolean;
  joinedAt: string;
}

/**
 * Payload for joining a voice call
 * @interface JoinCallPayload
 */
export interface JoinCallPayload {
  meetingId: string;
  userId: string;
  peerId: string;
  username: string;
}

/**
 * Payload for leaving a voice call
 * @interface LeaveCallPayload
 */
export interface LeaveCallPayload {
  meetingId: string;
  userId: string;
}

/**
 * Payload for mute/unmute actions
 * @interface MutePayload
 */
export interface MutePayload {
  meetingId: string;
  userId: string;
}

/**
 * Payload for video on/off actions
 * @interface VideoPayload
 */
export interface VideoPayload {
  meetingId: string;
  userId: string;
}

/**
 * WebRTC signal payload
 * @interface SignalPayload
 */
export interface SignalPayload {
  meetingId: string;
  fromUserId: string;
  toUserId: string;
  fromPeerId: string;
  toPeerId: string;
  signal: unknown;
  signalType: 'offer' | 'answer' | 'ice-candidate';
}

/**
 * Peers list response from server
 * @interface PeersListResponse
 */
export interface PeersListResponse {
  meetingId: string;
  participants: CallParticipant[];
  count: number;
}

/**
 * Peer joined notification
 * @interface PeerJoinedNotification
 */
export interface PeerJoinedNotification {
  userId: string;
  peerId: string;
  username: string;
  timestamp: string;
}

/**
 * Peer left notification
 * @interface PeerLeftNotification
 */
export interface PeerLeftNotification {
  userId: string;
  peerId: string;
  username: string;
  timestamp: string;
}

/**
 * Mute status notification
 * @interface MuteStatusNotification
 */
export interface MuteStatusNotification {
  userId: string;
  username: string;
  isMuted: boolean;
  timestamp: string;
}

/**
 * Video status notification
 * @interface VideoStatusNotification
 */
export interface VideoStatusNotification {
  userId: string;
  username: string;
  isVideoOn: boolean;
  timestamp: string;
}

/**
 * Call error response
 * @interface CallError
 */
export interface CallError {
  message: string;
  code?: string;
}

/**
 * Socket.IO event names for media calls (audio + video)
 * @constant CallEvents
 */
export const CallEvents = {
  JOIN: 'call:join',
  LEAVE: 'call:leave',
  SIGNAL: 'call:signal',
  MUTE: 'call:mute',
  UNMUTE: 'call:unmute',
  VIDEO_ON: 'call:video-on',
  VIDEO_OFF: 'call:video-off',
  PEER_JOINED: 'call:peer-joined',
  PEER_LEFT: 'call:peer-left',
  PEERS_LIST: 'call:peers-list',
  MUTE_STATUS: 'call:mute-status',
  VIDEO_STATUS: 'call:video-status',
  ICE_SERVERS: 'call:ice-servers',
  ERROR: 'call:error',
} as const;

/**
 * Call Service class for managing voice call connections
 * @class CallService
 * @description Singleton service for Socket.IO connection to voice call server
 */
class CallService {
  /** Socket.IO instance */
  private socket: Socket | null = null;
  
  /** Connection state flag */
  private isConnecting: boolean = false;
  
  /** ICE servers received from server */
  private iceServers: IceServer[] = [];

  /**
   * Connect to the voice call server
   * @returns {Socket} Socket instance
   * @throws {Error} If VITE_CALL_SERVER_URL is not configured
   */
  connect(): Socket {
    if (!CALL_SERVER_URL) {
      throw new Error('VITE_CALL_SERVER_URL is not configured. Please set this environment variable.');
    }

    if (this.socket?.connected || this.isConnecting) {
      return this.socket!;
    }

    this.isConnecting = true;

    this.socket = io(CALL_SERVER_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('🎙️ Call socket connected:', this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🎙️ Call socket disconnected:', reason);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🎙️ Call connection error:', error.message);
      this.isConnecting = false;
    });

    this.socket.on(CallEvents.ICE_SERVERS, (servers: IceServer[]) => {
      console.log('🎙️ ICE servers received:', servers.length);
      this.iceServers = servers;
    });

    return this.socket;
  }

  /**
   * Disconnect from the voice call server
   * @returns {void}
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
   * Get ICE servers configuration
   * @returns {IceServer[]} Array of ICE server configurations
   */
  getIceServers(): IceServer[] {
    return this.iceServers;
  }

  /**
   * Check if socket is connected
   * @returns {boolean} Connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Join a voice call room
   * @param {JoinCallPayload} payload - Join call payload
   * @returns {void}
   */
  joinCall(payload: JoinCallPayload): void {
    if (this.socket?.connected) {
      console.log('🎙️ Joining call:', payload.meetingId);
      this.socket.emit(CallEvents.JOIN, payload);
    } else {
      console.warn('🎙️ Cannot join call: Socket not connected');
    }
  }

  /**
   * Leave a voice call room
   * @param {LeaveCallPayload} payload - Leave call payload
   * @returns {void}
   */
  leaveCall(payload: LeaveCallPayload): void {
    if (this.socket?.connected) {
      console.log('🎙️ Leaving call:', payload.meetingId);
      this.socket.emit(CallEvents.LEAVE, payload);
    }
  }

  /**
   * Send WebRTC signal to another peer
   * @param {SignalPayload} payload - Signal payload
   * @returns {void}
   */
  sendSignal(payload: SignalPayload): void {
    if (this.socket?.connected) {
      this.socket.emit(CallEvents.SIGNAL, payload);
    }
  }

  /**
   * Notify server that user muted their microphone
   * @param {MutePayload} payload - Mute payload
   * @returns {void}
   */
  mute(payload: MutePayload): void {
    if (this.socket?.connected) {
      console.log('🎙️ Muting microphone');
      this.socket.emit(CallEvents.MUTE, payload);
    }
  }

  /**
   * Notify server that user unmuted their microphone
   * @param {MutePayload} payload - Unmute payload
   * @returns {void}
   */
  unmute(payload: MutePayload): void {
    if (this.socket?.connected) {
      console.log('🎙️ Unmuting microphone');
      this.socket.emit(CallEvents.UNMUTE, payload);
    }
  }

  /**
   * Notify server that user turned on their camera
   * @param {VideoPayload} payload - Video on payload
   * @returns {void}
   */
  videoOn(payload: MutePayload): void {
    if (this.socket?.connected) {
      console.log('📹 Turning on camera');
      this.socket.emit(CallEvents.VIDEO_ON, payload);
    }
  }

  /**
   * Notify server that user turned off their camera
   * @param {VideoPayload} payload - Video off payload
   * @returns {void}
   */
  videoOff(payload: MutePayload): void {
    if (this.socket?.connected) {
      console.log('📹 Turning off camera');
      this.socket.emit(CallEvents.VIDEO_OFF, payload);
    }
  }
}

/** Singleton instance of CallService */
const callService = new CallService();

export default callService;

