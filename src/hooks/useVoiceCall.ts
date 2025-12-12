/**
 * Voice/Video Call Hook for managing real-time audio and video communication
 * @module hooks/useVoiceCall
 * @description Custom hook that manages PeerJS connections for audio and video call state.
 * Audio and video are independent - you can toggle each separately.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import Peer from 'peerjs';
import type { MediaConnection } from 'peerjs';
import callService, { CallEvents } from '../services/callService';
import type {
  CallParticipant,
  PeersListResponse,
  PeerJoinedNotification,
  PeerLeftNotification,
  MuteStatusNotification,
  VideoStatusNotification,
  CallError,
  IceServer,
} from '../services/callService';
import type { Socket } from 'socket.io-client';

/**
 * Participant with mute and video status for UI
 * @interface VoiceParticipant
 */
export interface VoiceParticipant {
  userId: string;
  peerId: string;
  username: string;
  isMuted: boolean;
  isVideoOn: boolean;
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
  /** Whether local camera is on */
  isVideoOn: boolean;
  /** List of participants in the call */
  participants: VoiceParticipant[];
  /** Connection error message if any */
  connectionError: string | null;
  /** Whether call is active */
  isInCall: boolean;
  /** Local media stream (audio + video when enabled) */
  localStream: MediaStream | null;
  /** Remote video streams by peerId */
  remoteStreams: Map<string, MediaStream>;
  /** Toggle microphone mute state */
  toggleMute: () => void;
  /** Toggle camera on/off state */
  toggleVideo: () => Promise<void>;
  /** Join the call */
  joinVoiceCall: () => Promise<void>;
  /** Leave the call */
  leaveVoiceCall: () => Promise<void>;
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
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const connectionsRef = useRef<Map<string, MediaConnection>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const isJoiningRef = useRef<boolean>(false);
  const hasJoinedRef = useRef<boolean>(false);
  const isLeavingRef = useRef<boolean>(false);
  const iceServersRef = useRef<IceServer[]>([]);
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());

  /**
   * Stops and releases all tracks from a media stream
   * @param {MediaStream | null} stream - Stream to release
   * @returns {Promise<void>} Promise that resolves when all tracks are stopped
   */
  const releaseMediaStream = useCallback(async (stream: MediaStream | null): Promise<void> => {
    if (!stream) return;
    
    console.log('🧹 Releasing media stream tracks...');
    const tracks = stream.getTracks();
    
    tracks.forEach(track => {
      try {
        track.stop();
        console.log('🧹 Stopped track:', track.kind, track.label);
      } catch (error) {
        console.warn('🧹 Error stopping track:', track.kind, error);
      }
    });
    
    // Wait a bit to ensure tracks are fully released
    await new Promise(resolve => setTimeout(resolve, 100));
  }, []);

  /**
   * Get user media (microphone + camera from the start)
   * Both tracks are created but disabled by default
   * Ensures previous tracks are released before requesting new ones
   * @returns {Promise<MediaStream>} Audio + Video stream
   * @throws {Error} If media access is denied or unavailable
   */
  const getUserMedia = useCallback(async (): Promise<MediaStream> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMessage = 'Tu navegador no soporta acceso a multimedia. Por favor, usa un navegador moderno.';
      console.error('📹', errorMessage);
      throw new Error(errorMessage);
    }

    // First, ensure any existing tracks are released
    if (localStreamRef.current) {
      console.log('🧹 Releasing previous stream before requesting new one...');
      await releaseMediaStream(localStreamRef.current);
      localStreamRef.current = null;
    }

    // Also check for any active tracks in the system
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const activeTracks = devices.filter(device => device.label !== '');
      if (activeTracks.length > 0) {
        console.log('🧹 Found active tracks, waiting for release...');
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.warn('🧹 Could not enumerate devices:', error);
    }

    try {
      console.log('📹 Requesting microphone + camera permissions...');
      
      // Add timeout to prevent hanging
      const getUserMediaPromise = navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout starting video source'));
        }, 10000); // 10 second timeout
      });

      const stream = await Promise.race([getUserMediaPromise, timeoutPromise]);
      
      if (!stream) {
        throw new Error('No se pudo obtener el stream multimedia.');
      }

      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();
      
      console.log('📹 Media access granted - Audio tracks:', audioTracks.length, 'Video tracks:', videoTracks.length);

      // Disable all tracks by default (muted mic, camera off)
      audioTracks.forEach(track => {
        track.enabled = false;
        console.log('🎙️ Audio track disabled:', track.label);
      });
      
      videoTracks.forEach(track => {
        track.enabled = false;
        console.log('📹 Video track disabled:', track.label);
      });

      return stream;
    } catch (error) {
      console.error('📹 Error getting media:', error);
      
      let errorMessage = 'No se pudo acceder a la cámara y micrófono. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage += 'Por favor, permite el acceso a la cámara y micrófono en la configuración de tu navegador y recarga la página.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage += 'No se encontró cámara o micrófono. Verifica que los dispositivos estén conectados.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage += 'Los dispositivos están siendo usados por otra aplicación. Por favor, cierra otras aplicaciones que usen la cámara o micrófono y recarga la página.';
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
          errorMessage += 'Los dispositivos no cumplen con los requisitos necesarios.';
        } else if (error.message.includes('Timeout') || error.name === 'AbortError') {
          errorMessage += 'Timeout al acceder a los dispositivos. Esto puede ocurrir si los dispositivos están siendo usados por otra aplicación. Por favor, cierra otras aplicaciones que usen la cámara o micrófono, espera unos segundos y recarga la página.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage += 'Por favor, verifica los permisos del navegador y recarga la página.';
      }
      
      throw new Error(errorMessage);
    }
  }, [releaseMediaStream]);

  /**
   * Play remote audio stream and store video stream
   * @param {string} remoteUserId - User ID of the remote peer
   * @param {MediaStream} stream - Remote audio/video stream
   */
  const playRemoteStream = useCallback((remoteUserId: string, stream: MediaStream) => {
    // Verify stream is valid
    if (!stream || !stream.active) {
      console.warn('🎙️ Invalid or inactive stream received for:', remoteUserId);
      return;
    }

    // Check if this is the same stream we already have (avoid duplicate processing)
    const existingStream = remoteStreamsRef.current.get(remoteUserId);
    if (existingStream === stream) {
      console.log('🎙️ Stream unchanged for:', remoteUserId, 'skipping update');
      return;
    }

    // Handle audio - properly clean up existing audio before creating new one
    const existingAudio = audioElementsRef.current.get(remoteUserId);
    if (existingAudio) {
      try {
        // Pause and clear before removing to avoid interruption errors
        existingAudio.pause();
        existingAudio.srcObject = null;
        existingAudio.remove();
      } catch (error) {
        console.warn('🎙️ Error cleaning up existing audio:', error);
      }
      audioElementsRef.current.delete(remoteUserId);
    }

    // Create new audio element
    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
    (audio as HTMLAudioElement & { playsInline: boolean }).playsInline = true;
    audio.volume = 1.0;
    
    // Store audio element first
    audioElementsRef.current.set(remoteUserId, audio);
    
    // Try to play audio
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('🎙️ Audio playing successfully from:', remoteUserId);
        })
        .catch((error) => {
          // Ignore AbortError - it's usually because a new stream replaced it quickly
          if (error.name !== 'AbortError') {
            console.error('🎙️ Audio autoplay blocked for:', remoteUserId, error);
            console.warn('🎙️ User interaction may be required to play audio');
          }
        });
    }

    console.log('🎙️ Audio element created for:', remoteUserId, 'stream active:', stream.active);

    // Store full stream (including video) for video display
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.set(remoteUserId, stream);
      remoteStreamsRef.current = newMap; // Keep ref in sync
      return newMap;
    });
    console.log('📹 Stored remote stream from:', remoteUserId);
  }, []);

  /**
   * Stop remote audio/video stream
   * @param {string} remoteUserId - User ID of the remote peer
   */
  const stopRemoteStream = useCallback((remoteUserId: string) => {
    // Stop audio
    const audio = audioElementsRef.current.get(remoteUserId);
    if (audio) {
      audio.srcObject = null;
      audio.remove();
      audioElementsRef.current.delete(remoteUserId);
    }

    // Remove video stream from state
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.delete(remoteUserId);
      remoteStreamsRef.current = newMap; // Keep ref in sync
      return newMap;
    });

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

    if (connectionsRef.current.has(remoteUserId)) {
      console.log('🎙️ Already connected to peer:', remoteUserId);
      return;
    }

    const audioTracks = localStreamRef.current.getAudioTracks();
    if (audioTracks.length === 0) {
      console.warn('🎙️ Cannot call peer: No audio tracks in local stream');
      return;
    }

    console.log('🎙️ Calling peer:', peerId, 'userId:', remoteUserId, 'with', audioTracks.length, 'audio tracks');
    
    try {
      const call = peerRef.current.call(peerId, localStreamRef.current);
      
      if (!call) {
        console.error('🎙️ Failed to create call to peer:', peerId);
        return;
      }
      
      call.on('stream', (remoteStream) => {
        console.log('🎙️ Received stream from:', remoteUserId);
        console.log('🎙️ Remote stream active:', remoteStream.active, 'audio tracks:', remoteStream.getAudioTracks().length);
        
        if (remoteStream.getAudioTracks().length === 0) {
          console.warn('🎙️ Remote stream has no audio tracks from:', remoteUserId);
          return;
        }
        
        playRemoteStream(remoteUserId, remoteStream);
      });

      call.on('close', () => {
        console.log('🎙️ Call closed with:', remoteUserId);
        stopRemoteStream(remoteUserId);
      });

      call.on('error', (error) => {
        console.error('🎙️ Call error with:', remoteUserId, error);
        stopRemoteStream(remoteUserId);
      });

      connectionsRef.current.set(remoteUserId, call);
    } catch (error) {
      console.error('🎙️ Error calling peer:', peerId, error);
    }
  }, [playRemoteStream, stopRemoteStream]);

  /**
   * Handle incoming call from a peer
   * @param {MediaConnection} call - Incoming call
   */
  const handleIncomingCall = useCallback((call: MediaConnection) => {
    console.log('🎙️ Incoming call from peer:', call.peer);
    
    if (!localStreamRef.current) {
      console.warn('🎙️ Cannot answer: No local stream');
      call.close();
      return;
    }

    const audioTracks = localStreamRef.current.getAudioTracks();
    if (audioTracks.length === 0) {
      console.warn('🎙️ Cannot answer: No audio tracks in local stream');
      call.close();
      return;
    }

    console.log('🎙️ Answering call with local stream, tracks:', audioTracks.length);
    call.answer(localStreamRef.current);

    call.on('stream', (remoteStream) => {
      console.log('🎙️ Received stream from incoming call, peer:', call.peer);
      console.log('🎙️ Remote stream active:', remoteStream.active, 'audio tracks:', remoteStream.getAudioTracks().length);
      
      const participant = participants.find(p => p.peerId === call.peer);
      const remoteUserId = participant?.userId || call.peer;
      
      if (remoteStream.getAudioTracks().length === 0) {
        console.warn('🎙️ Remote stream has no audio tracks');
        return;
      }
      
      playRemoteStream(remoteUserId, remoteStream);
    });

    call.on('error', (error) => {
      console.error('🎙️ Call error:', error);
    });

    call.on('close', () => {
      console.log('🎙️ Incoming call closed');
      const participant = participants.find(p => p.peerId === call.peer);
      if (participant) {
        stopRemoteStream(participant.userId);
      }
    });

    const participant = participants.find(p => p.peerId === call.peer);
    const remoteUserId = participant?.userId || call.peer;
    if (remoteUserId) {
      connectionsRef.current.set(remoteUserId, call);
    }
  }, [participants, playRemoteStream, stopRemoteStream]);

  /**
   * Join the voice call
   */
  const joinVoiceCall = useCallback(async () => {
    if (isJoiningRef.current || hasJoinedRef.current) {
      console.log('🎙️ Already joining or joined, skipping...');
      return;
    }

    if (!meetingId || !userId || !username) {
      console.error('🎙️ Missing meeting data:', { meetingId, userId, username });
      setConnectionError('Missing meeting data');
      return;
    }

    isJoiningRef.current = true;
    console.log('📹 Starting call join process...');

    try {
      console.log('📹 Requesting camera + microphone access...');
      const stream = await getUserMedia();
      
      if (!stream) {
        const errorMessage = 'No se pudo obtener el stream multimedia. Por favor, recarga la página e intenta de nuevo.';
        console.error('📹', errorMessage);
        setConnectionError(errorMessage);
        isJoiningRef.current = false;
        return;
      }

      // Check if we're still supposed to be joining (not cancelled by cleanup)
      if (!isJoiningRef.current) {
        console.log('📹 Join was cancelled, releasing stream...');
        await releaseMediaStream(stream);
        return;
      }
      
      localStreamRef.current = stream;
      setLocalStream(stream);
      console.log('📹 Media access granted, stream active:', stream.active);

      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();
      
      console.log('📹 Tracks - Audio:', audioTracks.length, 'Video:', videoTracks.length);
      
      // Set up track event listeners
      audioTracks.forEach(track => {
        track.onended = () => {
          console.warn('🎙️ Audio track ended unexpectedly');
          setConnectionError('El micrófono se desconectó. Por favor, recarga la página.');
        };
      });
      
      videoTracks.forEach(track => {
        track.onended = () => {
          console.warn('📹 Video track ended unexpectedly');
        };
      });

      // Both mic and camera start disabled (getUserMedia already did this)
      setIsMuted(true);
      setIsVideoOn(false);

      console.log('🎙️ Connecting to call server...');
      let socket: Socket;
      try {
        socket = callService.connect();
      } catch (error) {
        console.error('🎙️ Failed to connect to call server:', error);
        if (error instanceof Error) {
          setConnectionError(error.message);
        }
        // Release stream if connection fails
        if (localStreamRef.current) {
          await releaseMediaStream(localStreamRef.current);
          localStreamRef.current = null;
          setLocalStream(null);
        }
        isJoiningRef.current = false;
        return;
      }
      socketRef.current = socket;

      const waitForSocketConnect = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Socket connection timeout. Please check that VITE_CALL_SERVER_URL is configured correctly in Vercel.'));
        }, 25000);

        if (socket.connected) {
          clearTimeout(timeout);
          resolve();
        } else {
          socket.once('connect', () => {
            clearTimeout(timeout);
            console.log('🎙️ Socket connected, creating PeerJS...');
            resolve();
          });
          socket.once('connect_error', (err) => {
            clearTimeout(timeout);
            const errorMessage = err.message || 'Connection error';
            reject(new Error(`Failed to connect to call server: ${errorMessage}. Please verify VITE_CALL_SERVER_URL is set in Vercel.`));
          });
        }
      });

      try {
        await waitForSocketConnect;
      } catch (error) {
        console.error('🎙️ Socket connection failed:', error);
        if (error instanceof Error) {
          setConnectionError(error.message);
        }
        // Release stream if socket connection fails
        if (localStreamRef.current) {
          await releaseMediaStream(localStreamRef.current);
          localStreamRef.current = null;
          setLocalStream(null);
        }
        callService.disconnect();
        socketRef.current = null;
        isJoiningRef.current = false;
        return;
      }

      // Check if we're still supposed to be joining (not cancelled by cleanup)
      if (!isJoiningRef.current) {
        console.log('📹 Join was cancelled after socket connect, cleaning up...');
        await releaseMediaStream(localStreamRef.current);
        localStreamRef.current = null;
        setLocalStream(null);
        callService.disconnect();
        socketRef.current = null;
        return;
      }

      // Wait a bit for ICE servers to be received from backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check again after waiting
      if (!isJoiningRef.current) {
        console.log('📹 Join was cancelled after waiting for ICE servers, cleaning up...');
        await releaseMediaStream(localStreamRef.current);
        localStreamRef.current = null;
        setLocalStream(null);
        callService.disconnect();
        socketRef.current = null;
        return;
      }
      
      // Get ICE servers from callService (received from backend, includes ExpressTURN)
      const iceServers = callService.getIceServers();
      iceServersRef.current = iceServers;
      console.log('🎙️ Using ICE servers:', iceServers.length > 0 ? iceServers : 'default');

      console.log('🎙️ Creating PeerJS instance...');
      const peer = new Peer({
        config: {
          iceServers: iceServers.length > 0 ? iceServers : [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ]
        },
        debug: 2,
      });
      peerRef.current = peer;

      peer.on('open', (peerId) => {
        // Check if we're still supposed to be joining
        if (!isJoiningRef.current) {
          console.log('📹 Join was cancelled when PeerJS opened, cleaning up...');
          peer.destroy();
          peerRef.current = null;
          return;
        }

        console.log('🎙️ PeerJS connected with ID:', peerId);
        
        // Verify socket is still connected before joining
        if (!socket.connected) {
          console.warn('🎙️ Socket disconnected before join, waiting for reconnect...');
          const reconnectTimeout = setTimeout(() => {
            console.error('🎙️ Socket reconnect timeout, cannot join call');
            setConnectionError('No se pudo conectar al servidor. Por favor, recarga la página.');
            isJoiningRef.current = false;
            hasJoinedRef.current = false;
          }, 10000); // 10 second timeout for reconnect

          socket.once('connect', () => {
            clearTimeout(reconnectTimeout);
            console.log('🎙️ Socket reconnected, joining call...');
            if (isJoiningRef.current) {
              callService.joinCall({
                meetingId,
                userId,
                peerId,
                username,
              });
              setIsInCall(true);
              setIsConnected(true);
              setConnectionError(null);
              hasJoinedRef.current = true;
              isJoiningRef.current = false;
            }
          });
        } else {
          console.log('🎙️ Emitting call:join with:', { meetingId, userId, peerId, username });
          callService.joinCall({
            meetingId,
            userId,
            peerId,
            username,
          });

          setIsInCall(true);
          setIsConnected(true);
          setConnectionError(null);
          hasJoinedRef.current = true;
          isJoiningRef.current = false;
        }
      });

      peer.on('call', (call) => {
        console.log('🎙️ Incoming call from peer:', call.peer);
        handleIncomingCall(call);
      });

      peer.on('error', (error) => {
        console.error('🎙️ PeerJS error:', error.type, error.message);
        if (error.type !== 'peer-unavailable') {
          setConnectionError(`PeerJS error: ${error.message}`);
        }
      });

      peer.on('disconnected', () => {
        console.log('🎙️ PeerJS disconnected, attempting to reconnect...');
        peer.reconnect();
      });

      peer.on('close', () => {
        console.log('🎙️ PeerJS connection closed');
      });

      socket.on('connect', () => {
        console.log('🎙️ Call socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', (reason) => {
        console.log('🎙️ Call socket disconnected:', reason);
        setIsConnected(false);
      });

      socket.on(CallEvents.PEERS_LIST, (data: PeersListResponse) => {
        console.log('🎙️ Peers list received:', data.count, data.participants);
        
        setParticipants(data.participants.map((p: CallParticipant) => ({
          userId: p.userId,
          peerId: p.peerId,
          username: p.username,
          isMuted: p.isMuted,
          isVideoOn: p.isVideoOn,
        })));

        data.participants.forEach((p: CallParticipant) => {
          if (p.userId !== userId) {
            console.log('🎙️ Will call peer:', p.username, 'with peerId:', p.peerId);
            setTimeout(() => callPeer(p.peerId, p.userId), 1000);
          }
        });
      });

      socket.on(CallEvents.PEER_JOINED, (data: PeerJoinedNotification) => {
        console.log('🎙️ Peer joined:', data.username, 'peerId:', data.peerId);
        
        setParticipants(prev => {
          if (prev.find(p => p.userId === data.userId)) {
            return prev;
          }
          return [...prev, {
            userId: data.userId,
            peerId: data.peerId,
            username: data.username,
            isMuted: true,
            isVideoOn: false,
          }];
        });

        if (peerRef.current && localStreamRef.current) {
          console.log('🎙️ Calling new peer:', data.peerId);
          setTimeout(() => callPeer(data.peerId, data.userId), 1000);
        }
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

      socket.on(CallEvents.VIDEO_STATUS, (data: VideoStatusNotification) => {
        console.log('📹 Video status changed:', data.username, data.isVideoOn);
        
        setParticipants(prev => prev.map(p => 
          p.userId === data.userId ? { ...p, isVideoOn: data.isVideoOn } : p
        ));
      });

      socket.on(CallEvents.ERROR, (error: CallError) => {
        console.error('🎙️ Call server error:', error);
        setConnectionError(error.message);
      });

    } catch (error) {
      console.error('🎙️ Error joining voice call:', error);
      if (error instanceof Error) {
        setConnectionError(error.message);
      }
      isJoiningRef.current = false;
      hasJoinedRef.current = false;
    }
  }, [meetingId, userId, username, getUserMedia, handleIncomingCall, callPeer, stopRemoteStream, releaseMediaStream]);

  /**
   * Leave the call
   * Properly releases all media tracks and connections
   */
  const leaveVoiceCall = useCallback(async () => {
    // Prevent multiple simultaneous calls to leaveVoiceCall
    if (isLeavingRef.current) {
      console.log('🎙️ Already leaving call, skipping...');
      return;
    }

    // Don't leave if we're currently joining - wait for join to complete or fail
    if (isJoiningRef.current) {
      console.log('🎙️ Cannot leave while joining, waiting for join to complete...');
      // Wait a bit and check again
      setTimeout(() => {
        if (!isJoiningRef.current && !isLeavingRef.current) {
          void leaveVoiceCall();
        }
      }, 1000);
      return;
    }

    // If we never joined and have no resources, there's nothing to clean up
    if (!hasJoinedRef.current && !localStreamRef.current && !peerRef.current && !socketRef.current) {
      console.log('🎙️ Nothing to clean up, skipping leave...');
      return;
    }

    isLeavingRef.current = true;
    console.log('🎙️ Leaving call');

    isJoiningRef.current = false;
    hasJoinedRef.current = false;

    // Stop all audio elements
    audioElementsRef.current.forEach((audio) => {
      try {
        audio.pause();
        audio.srcObject = null;
        audio.remove();
      } catch (error) {
        console.warn('🧹 Error removing audio element:', error);
      }
    });
    audioElementsRef.current.clear();

    // Close all peer connections
    connectionsRef.current.forEach((connection) => {
      try {
        connection.close();
      } catch (error) {
        console.warn('🧹 Error closing connection:', error);
      }
    });
    connectionsRef.current.clear();

    // Stop all remote streams
    // Use setRemoteStreams callback to access current streams
    setRemoteStreams(currentStreams => {
      currentStreams.forEach((stream) => {
        stream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (error) {
            console.warn('🧹 Error stopping remote track:', error);
          }
        });
      });
      const newMap = new Map();
      remoteStreamsRef.current = newMap; // Keep ref in sync
      return newMap;
    });

    // Stop all local tracks (audio AND video) properly
    if (localStreamRef.current) {
      await releaseMediaStream(localStreamRef.current);
      localStreamRef.current = null;
    }

    // Also clear the state stream
    if (localStream) {
      await releaseMediaStream(localStream);
    }
    setLocalStream(null);

    // Notify server
    if (meetingId && userId) {
      try {
        callService.leaveCall({ meetingId, userId });
      } catch (error) {
        console.warn('🧹 Error notifying server:', error);
      }
    }

    // Destroy PeerJS
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch (error) {
        console.warn('🧹 Error destroying peer:', error);
      }
      peerRef.current = null;
    }

    // Disconnect socket
    try {
      callService.disconnect();
    } catch (error) {
      console.warn('🧹 Error disconnecting call service:', error);
    }
    socketRef.current = null;

    // Reset all state
    setIsInCall(false);
    setIsConnected(false);
    setParticipants([]);
    setIsMuted(true);
    setIsVideoOn(false);
    
    // Reset leaving flag after a short delay to allow cleanup to complete
    setTimeout(() => {
      isLeavingRef.current = false;
    }, 500);
  }, [meetingId, userId, localStream, releaseMediaStream, setRemoteStreams]);

  /**
   * Toggle microphone mute state (independent of video)
   */
  const toggleMute = useCallback(() => {
    // Check both ref and state for stream availability
    const stream = localStreamRef.current || localStream;
    
    if (!stream) {
      const errorMessage = 'No hay acceso al micrófono. Por favor, espera a que se complete la conexión o recarga la página.';
      console.warn('🎙️ Cannot toggle mute: No local stream available');
      setConnectionError(errorMessage);
      return;
    }

    if (!meetingId || !userId) {
      console.warn('🎙️ Cannot toggle mute: Missing meeting data');
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      const errorMessage = 'No se encontraron pistas de audio. Por favor, verifica tu micrófono y recarga la página.';
      console.warn('🎙️ Cannot toggle mute: No audio tracks');
      setConnectionError(errorMessage);
      return;
    }

    const newMutedState = !isMuted;
    
    audioTracks.forEach(track => {
      track.enabled = !newMutedState;
      console.log('🎙️ Track', track.label, 'enabled:', !newMutedState, 'muted:', track.muted, 'readyState:', track.readyState);
    });

    if (socketRef.current?.connected) {
      if (newMutedState) {
        callService.mute({ meetingId, userId });
      } else {
        callService.unmute({ meetingId, userId });
      }
    }

    setIsMuted(newMutedState);
    console.log('🎙️ Microphone', newMutedState ? 'muted' : 'unmuted');
  }, [isMuted, meetingId, userId, localStream]);

  /**
   * Toggle camera on/off state (independent of audio)
   * Enables/disables video track AND re-calls peers to ensure they receive the change
   */
  const toggleVideo = useCallback(async () => {
    // Check both ref and state for stream availability
    const stream = localStreamRef.current || localStream;
    
    if (!stream || !meetingId || !userId || !peerRef.current) {
      console.warn('📹 Cannot toggle video: Missing requirements', {
        hasStream: !!stream,
        hasMeetingId: !!meetingId,
        hasUserId: !!userId,
        hasPeer: !!peerRef.current
      });
      setConnectionError('No se puede cambiar el estado de la cámara. Por favor, espera a que se complete la conexión.');
      return;
    }

    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) {
      console.warn('📹 No video tracks available');
      setConnectionError('No se encontró ninguna cámara disponible.');
      return;
    }

    const newVideoState = !isVideoOn;

    // Toggle the enabled state of video tracks
    videoTracks.forEach(track => {
      track.enabled = newVideoState;
      console.log('📹 Video track', track.label, 'enabled:', newVideoState);
    });

    // Update local stream state to trigger UI update
    // Force a state update by creating a new MediaStream reference
    // This is necessary to trigger React re-render and update video elements
    const currentStream = localStreamRef.current || stream;
    if (currentStream) {
      // Create a new MediaStream with the same tracks to trigger React update
      // The tracks themselves are the same, we just need a new reference for React
      const tracks = currentStream.getTracks();
      const newStream = new MediaStream(tracks);
      setLocalStream(newStream);
      // Also update the ref to keep it in sync
      localStreamRef.current = newStream;
    }

    // Re-call all peers to ensure they receive the video change
    // This is necessary because WebRTC doesn't always propagate track.enabled changes
    const currentParticipants = [...participants];
    console.log('📹 Re-calling', currentParticipants.length, 'peers after video toggle');

    currentParticipants.forEach((participant) => {
      const currentStream = localStreamRef.current || stream;
      if (participant.userId !== userId && peerRef.current && currentStream) {
        console.log('📹 Re-calling peer:', participant.username);

        // Close existing connection and clean up properly
        const existingConnection = connectionsRef.current.get(participant.userId);
        if (existingConnection) {
          // Remove event listeners to prevent duplicate stream events
          existingConnection.removeAllListeners('stream');
          existingConnection.removeAllListeners('close');
          existingConnection.removeAllListeners('error');
          existingConnection.close();
          connectionsRef.current.delete(participant.userId);
        }

        // Small delay to ensure previous connection is fully closed
        setTimeout(() => {
          // Double-check connection doesn't exist before creating new one
          if (connectionsRef.current.has(participant.userId)) {
            console.log('📹 Connection already exists for:', participant.userId, 'skipping re-call');
            return;
          }

          // Verify peer is still available
          if (!peerRef.current) {
            console.error('📹 Peer not available for re-call to:', participant.userId);
            return;
          }

          // Create new call with current stream
          const call = peerRef.current.call(participant.peerId, currentStream);

          if (!call) {
            console.error('📹 Failed to create call to:', participant.userId);
            return;
          }

          let streamReceived = false;
          call.on('stream', (remoteStream) => {
            // Prevent duplicate stream processing
            if (streamReceived) {
              console.log('📹 Duplicate stream event ignored for:', participant.userId);
              return;
            }
            streamReceived = true;
            console.log('📹 Received stream after re-call from:', participant.userId);
            playRemoteStream(participant.userId, remoteStream);
          });

          call.on('close', () => {
            console.log('📹 Call closed with:', participant.userId);
            // Only clean up if this connection is still the current one
            if (connectionsRef.current.get(participant.userId) === call) {
              connectionsRef.current.delete(participant.userId);
            }
          });

          call.on('error', (error) => {
            console.error('📹 Call error with:', participant.userId, error);
          });

          connectionsRef.current.set(participant.userId, call);
        }, 100); // Small delay to ensure previous connection is closed
      }
    });

    // Notify server about video status change
    if (socketRef.current?.connected) {
      if (newVideoState) {
        callService.videoOn({ meetingId, userId });
      } else {
        callService.videoOff({ meetingId, userId });
      }
    }

    setIsVideoOn(newVideoState);
    console.log('📹 Camera', newVideoState ? 'on' : 'off');
  }, [isVideoOn, meetingId, userId, participants, playRemoteStream, localStream]);

  // Cleanup on unmount - only if we actually joined
  // Use a ref to store leaveVoiceCall to avoid dependency issues
  const leaveVoiceCallRef = useRef(leaveVoiceCall);
  leaveVoiceCallRef.current = leaveVoiceCall;

  useEffect(() => {
    return () => {
      // Only cleanup if we actually joined or have resources
      if (hasJoinedRef.current || localStreamRef.current || peerRef.current || socketRef.current) {
        void leaveVoiceCallRef.current();
      }
    };
  }, []); // Empty deps - only run on unmount

  // Update localStream state when stream changes
  useEffect(() => {
    if (localStreamRef.current) {
      setLocalStream(localStreamRef.current);
    }
  }, [isInCall]);

  // Keep remoteStreamsRef in sync with remoteStreams state
  useEffect(() => {
    remoteStreamsRef.current = remoteStreams;
  }, [remoteStreams]);

  return {
    isConnected,
    isMuted,
    isVideoOn,
    participants,
    connectionError,
    isInCall,
    localStream,
    remoteStreams,
    toggleMute,
    toggleVideo,
    joinVoiceCall,
    leaveVoiceCall,
  };
};

