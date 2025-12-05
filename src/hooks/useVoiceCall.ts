/**
 * Voice Call Hook for managing real-time voice communication
 * @module hooks/useVoiceCall
 * @description Custom hook that manages PeerJS connections and voice call state
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import callService, {
  CallEvents,
  CallParticipant,
  PeersListResponse,
  PeerJoinedNotification,
  PeerLeftNotification,
  MuteStatusNotification,
  CallError,
} from '../services/callService';
import type { Socket } from 'socket.io-client';

/**
 * Participant with mute status for UI
 * @interface VoiceParticipant
 */
export interface VoiceParticipant {
  userId: string;
  peerId: string;
  username: string;
  isMuted: boolean;
}

/**
 * Return type for useVoiceCall hook
 * @interface UseVoiceCallReturn
 */
interface UseVoiceCallReturn {
  /** Whether connected to call server */
  isConnected: boolean;
  /** Whether local microphone is muted */
  isMuted: boolean;
  /** List of participants in the call */
  participants: VoiceParticipant[];
  /** Connection error message if any */
  connectionError: string | null;
  /** Whether voice call is active */
  isInCall: boolean;
  /** Toggle microphone mute state */
  toggleMute: () => void;
  /** Join the voice call */
  joinVoiceCall: () => Promise<void>;
  /** Leave the voice call */
  leaveVoiceCall: () => void;
}

/**
 * Custom hook for managing voice call functionality
 * @param {string | undefined} meetingId - Meeting ID
 * @param {string | undefined} userId - User ID
 * @param {string | undefined} username - Username
 * @returns {UseVoiceCallReturn} Voice call state and functions
 */
export const useVoiceCall = (
  meetingId: string | undefined,
  userId: string | undefined,
  username: string | undefined
): UseVoiceCallReturn => {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);

  // Refs
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const connectionsRef = useRef<Map<string, MediaConnection>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  /**
   * Get user media (microphone)
   * @returns {Promise<MediaStream>} Audio stream
   */
  const getUserMedia = useCallback(async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      return stream;
    } catch (error) {
      console.error('🎙️ Error getting microphone:', error);
      throw new Error('Could not access microphone. Please check permissions.');
    }
  }, []);

  /**
   * Play remote audio stream
   * @param {string} remoteUserId - User ID of the remote peer
   * @param {MediaStream} stream - Remote audio stream
   */
  const playRemoteStream = useCallback((remoteUserId: string, stream: MediaStream) => {
    // Remove existing audio element if any
    const existingAudio = audioElementsRef.current.get(remoteUserId);
    if (existingAudio) {
      existingAudio.srcObject = null;
      existingAudio.remove();
    }

    // Create new audio element
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
    audio.playsInline = true;
    
    audio.play().catch((error) => {
      console.warn('🎙️ Audio autoplay blocked:', error);
    });

    audioElementsRef.current.set(remoteUserId, audio);
    console.log('🎙️ Playing audio from:', remoteUserId);
  }, []);

  /**
   * Stop remote audio stream
   * @param {string} remoteUserId - User ID of the remote peer
   */
  const stopRemoteStream = useCallback((remoteUserId: string) => {
    const audio = audioElementsRef.current.get(remoteUserId);
    if (audio) {
      audio.srcObject = null;
      audio.remove();
      audioElementsRef.current.delete(remoteUserId);
    }

    const connection = connectionsRef.current.get(remoteUserId);
    if (connection) {
      connection.close();
      connectionsRef.current.delete(remoteUserId);
    }
  }, []);

  /**
   * Call a remote peer
   * @param {string} peerId - PeerJS peer ID to call
   * @param {string} remoteUserId - User ID of the peer
   */
  const callPeer = useCallback((peerId: string, remoteUserId: string) => {
    if (!peerRef.current || !localStreamRef.current) {
      console.warn('🎙️ Cannot call peer: Peer or stream not ready');
      return;
    }

    console.log('🎙️ Calling peer:', peerId);
    
    const call = peerRef.current.call(peerId, localStreamRef.current);
    
    call.on('stream', (remoteStream) => {
      console.log('🎙️ Received stream from:', remoteUserId);
      playRemoteStream(remoteUserId, remoteStream);
    });

    call.on('close', () => {
      console.log('🎙️ Call closed with:', remoteUserId);
      stopRemoteStream(remoteUserId);
    });

    call.on('error', (error) => {
      console.error('🎙️ Call error with:', remoteUserId, error);
    });

    connectionsRef.current.set(remoteUserId, call);
  }, [playRemoteStream, stopRemoteStream]);

  /**
   * Handle incoming call from a peer
   * @param {MediaConnection} call - Incoming call
   */
  const handleIncomingCall = useCallback((call: MediaConnection) => {
    console.log('🎙️ Incoming call from:', call.peer);
    
    if (!localStreamRef.current) {
      console.warn('🎙️ Cannot answer: No local stream');
      return;
    }

    call.answer(localStreamRef.current);

    call.on('stream', (remoteStream) => {
      // Find user ID from peer ID
      const participant = participants.find(p => p.peerId === call.peer);
      const remoteUserId = participant?.userId || call.peer;
      console.log('🎙️ Received stream from incoming call:', remoteUserId);
      playRemoteStream(remoteUserId, remoteStream);
    });

    call.on('close', () => {
      const participant = participants.find(p => p.peerId === call.peer);
      if (participant) {
        stopRemoteStream(participant.userId);
      }
    });
  }, [participants, playRemoteStream, stopRemoteStream]);

  /**
   * Join the voice call
   */
  const joinVoiceCall = useCallback(async () => {
    if (!meetingId || !userId || !username) {
      setConnectionError('Missing meeting data');
      return;
    }

    try {
      // Get microphone access
      const stream = await getUserMedia();
      localStreamRef.current = stream;

      // Mute by default
      stream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      setIsMuted(true);

      // Connect to call server
      let socket: Socket;
      try {
        socket = callService.connect();
      } catch (error) {
        if (error instanceof Error) {
          setConnectionError(error.message);
        }
        return;
      }
      socketRef.current = socket;

      // Wait for ICE servers and create PeerJS instance
      const iceServers = callService.getIceServers();
      const peerConfig = iceServers.length > 0 
        ? { config: { iceServers } }
        : { config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] } };

      const peer = new Peer(peerConfig);
      peerRef.current = peer;

      peer.on('open', (peerId) => {
        console.log('🎙️ PeerJS connected with ID:', peerId);
        
        // Join the call room
        callService.joinCall({
          meetingId,
          userId,
          peerId,
          username,
        });

        setIsInCall(true);
        setIsConnected(true);
        setConnectionError(null);
      });

      peer.on('call', handleIncomingCall);

      peer.on('error', (error) => {
        console.error('🎙️ PeerJS error:', error);
        setConnectionError(`PeerJS error: ${error.message}`);
      });

      peer.on('disconnected', () => {
        console.log('🎙️ PeerJS disconnected');
      });

      // Socket event handlers
      socket.on('connect', () => {
        console.log('🎙️ Call socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('🎙️ Call socket disconnected');
        setIsConnected(false);
      });

      socket.on(CallEvents.PEERS_LIST, (data: PeersListResponse) => {
        console.log('🎙️ Peers list received:', data.count);
        
        // Update participants
        setParticipants(data.participants.map((p: CallParticipant) => ({
          userId: p.userId,
          peerId: p.peerId,
          username: p.username,
          isMuted: p.isMuted,
        })));

        // Call each existing peer
        data.participants.forEach((p: CallParticipant) => {
          if (p.userId !== userId) {
            setTimeout(() => callPeer(p.peerId, p.userId), 500);
          }
        });
      });

      socket.on(CallEvents.PEER_JOINED, (data: PeerJoinedNotification) => {
        console.log('🎙️ Peer joined:', data.username);
        
        setParticipants(prev => {
          if (prev.find(p => p.userId === data.userId)) {
            return prev;
          }
          return [...prev, {
            userId: data.userId,
            peerId: data.peerId,
            username: data.username,
            isMuted: true,
          }];
        });

        // The new peer will call us, we just need to answer (handled by peer.on('call'))
      });

      socket.on(CallEvents.PEER_LEFT, (data: PeerLeftNotification) => {
        console.log('🎙️ Peer left:', data.username);
        
        stopRemoteStream(data.userId);
        setParticipants(prev => prev.filter(p => p.userId !== data.userId));
      });

      socket.on(CallEvents.MUTE_STATUS, (data: MuteStatusNotification) => {
        console.log('🎙️ Mute status changed:', data.username, data.isMuted);
        
        setParticipants(prev => prev.map(p => 
          p.userId === data.userId ? { ...p, isMuted: data.isMuted } : p
        ));
      });

      socket.on(CallEvents.ERROR, (error: CallError) => {
        console.error('🎙️ Call error:', error);
        setConnectionError(error.message);
      });

    } catch (error) {
      console.error('🎙️ Error joining voice call:', error);
      if (error instanceof Error) {
        setConnectionError(error.message);
      }
    }
  }, [meetingId, userId, username, getUserMedia, handleIncomingCall, callPeer, stopRemoteStream]);

  /**
   * Leave the voice call
   */
  const leaveVoiceCall = useCallback(() => {
    console.log('🎙️ Leaving voice call');

    // Stop all remote streams
    audioElementsRef.current.forEach((audio) => {
      audio.srcObject = null;
      audio.remove();
    });
    audioElementsRef.current.clear();

    // Close all peer connections
    connectionsRef.current.forEach((connection) => {
      connection.close();
    });
    connectionsRef.current.clear();

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Leave call room
    if (meetingId && userId) {
      callService.leaveCall({ meetingId, userId });
    }

    // Destroy PeerJS
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Disconnect socket
    callService.disconnect();
    socketRef.current = null;

    // Reset state
    setIsInCall(false);
    setIsConnected(false);
    setParticipants([]);
    setIsMuted(true);
  }, [meetingId, userId]);

  /**
   * Toggle microphone mute state
   */
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current || !meetingId || !userId) return;

    const newMutedState = !isMuted;
    
    // Toggle audio track
    localStreamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !newMutedState;
    });

    // Notify server
    if (newMutedState) {
      callService.mute({ meetingId, userId });
    } else {
      callService.unmute({ meetingId, userId });
    }

    setIsMuted(newMutedState);
    console.log('🎙️ Microphone', newMutedState ? 'muted' : 'unmuted');
  }, [isMuted, meetingId, userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveVoiceCall();
    };
  }, []);

  return {
    isConnected,
    isMuted,
    participants,
    connectionError,
    isInCall,
    toggleMute,
    joinVoiceCall,
    leaveVoiceCall,
  };
};

