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
  const iceServersRef = useRef<IceServer[]>([]);

  /**
   * Get user media (microphone)
   * @returns {Promise<MediaStream>} Audio stream
   * @throws {Error} If microphone access is denied or unavailable
   */
  const getUserMedia = useCallback(async (): Promise<MediaStream> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMessage = 'Tu navegador no soporta acceso al micrófono. Por favor, usa un navegador moderno.';
      console.error('🎙️', errorMessage);
      throw new Error(errorMessage);
    }

    try {
      console.log('🎙️ Requesting microphone permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      
      if (!stream || stream.getAudioTracks().length === 0) {
        const errorMessage = 'No se pudo acceder al micrófono. Verifica que el dispositivo esté conectado y los permisos estén habilitados.';
        console.error('🎙️', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('🎙️ Microphone access granted, tracks:', stream.getAudioTracks().length);
      return stream;
    } catch (error) {
      console.error('🎙️ Error getting microphone:', error);
      
      let errorMessage = 'No se pudo acceder al micrófono. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage += 'Por favor, permite el acceso al micrófono en la configuración de tu navegador y recarga la página.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage += 'No se encontró ningún micrófono. Verifica que el dispositivo esté conectado.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage += 'El micrófono está siendo usado por otra aplicación. Cierra otras aplicaciones que lo estén usando.';
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
          errorMessage += 'El micrófono no cumple con los requisitos necesarios.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage += 'Por favor, verifica los permisos del navegador y recarga la página.';
      }
      
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Play remote audio stream and store video stream
   * @param {string} remoteUserId - User ID of the remote peer
   * @param {MediaStream} stream - Remote audio/video stream
   */
  const playRemoteStream = useCallback((remoteUserId: string, stream: MediaStream) => {
    // Handle audio - create audio element for playback
    const existingAudio = audioElementsRef.current.get(remoteUserId);
    if (existingAudio) {
      existingAudio.srcObject = null;
      existingAudio.remove();
    }

    const audio = new Audio();
    audio.srcObject = stream;
    audio.autoplay = true;
    (audio as HTMLAudioElement & { playsInline: boolean }).playsInline = true;
    
    audio.play().catch((error) => {
      console.warn('🎙️ Audio autoplay blocked:', error);
    });

    audioElementsRef.current.set(remoteUserId, audio);
    console.log('🎙️ Playing audio from:', remoteUserId);

    // Store full stream (including video) for video display
    setRemoteStreams(prev => {
      const newMap = new Map(prev);
      newMap.set(remoteUserId, stream);
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
    console.log('🎙️ Starting voice call join process...');

    try {
      console.log('🎙️ Requesting microphone access...');
      const stream = await getUserMedia();
      
      if (!stream) {
        const errorMessage = 'No se pudo obtener el stream del micrófono. Por favor, recarga la página e intenta de nuevo.';
        console.error('🎙️', errorMessage);
        setConnectionError(errorMessage);
        return;
      }
      
      localStreamRef.current = stream;
      console.log('🎙️ Microphone access granted, stream active:', stream.active);

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        const errorMessage = 'No se encontraron pistas de audio en el stream. Por favor, verifica tu micrófono.';
        console.error('🎙️', errorMessage);
        setConnectionError(errorMessage);
        return;
      }

      console.log('🎙️ Audio tracks found:', audioTracks.length);
      audioTracks.forEach(track => {
        console.log('🎙️ Track:', track.label, 'enabled:', track.enabled, 'muted:', track.muted, 'readyState:', track.readyState);
        track.enabled = false;
        
        track.onended = () => {
          console.warn('🎙️ Audio track ended unexpectedly');
          setConnectionError('El micrófono se desconectó. Por favor, recarga la página.');
        };
        
        track.onmute = () => {
          console.warn('🎙️ Audio track muted by system');
        };
        
        track.onunmute = () => {
          console.log('🎙️ Audio track unmuted by system');
        };
      });
      setIsMuted(true);

      console.log('🎙️ Connecting to call server...');
      let socket: Socket;
      try {
        socket = callService.connect();
      } catch (error) {
        console.error('🎙️ Failed to connect to call server:', error);
        if (error instanceof Error) {
          setConnectionError(error.message);
        }
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

      await waitForSocketConnect;

      // Wait a bit for ICE servers to be received from backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
        console.log('🎙️ PeerJS connected with ID:', peerId);
        
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
  }, [meetingId, userId, username, getUserMedia, handleIncomingCall, callPeer, stopRemoteStream]);

  /**
   * Leave the call
   */
  const leaveVoiceCall = useCallback(() => {
    console.log('🎙️ Leaving call');

    isJoiningRef.current = false;
    hasJoinedRef.current = false;

    // Stop all audio elements
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

    // Stop all local tracks (audio AND video)
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Notify server
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

    // Reset all state
    setIsInCall(false);
    setIsConnected(false);
    setParticipants([]);
    setIsMuted(true);
    setIsVideoOn(false);
    setLocalStream(null);
    setRemoteStreams(new Map());
  }, [meetingId, userId]);

  /**
   * Toggle microphone mute state (independent of video)
   */
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) {
      const errorMessage = 'No hay acceso al micrófono. Por favor, recarga la página y permite el acceso al micrófono.';
      console.warn('🎙️ Cannot toggle mute: No local stream');
      setConnectionError(errorMessage);
      return;
    }

    if (!meetingId || !userId) {
      console.warn('🎙️ Cannot toggle mute: Missing meeting data');
      return;
    }

    const audioTracks = localStreamRef.current.getAudioTracks();
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
  }, [isMuted, meetingId, userId]);

  /**
   * Toggle camera on/off state (independent of audio)
   */
  const toggleVideo = useCallback(async () => {
    if (!localStreamRef.current || !meetingId || !userId) {
      console.warn('📹 Cannot toggle video: Missing requirements');
      return;
    }

    const newVideoState = !isVideoOn;

    try {
      if (newVideoState) {
        // Turn ON camera - get video stream and add to existing stream
        console.log('📹 Requesting camera access...');
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
        });

        const videoTrack = videoStream.getVideoTracks()[0];
        if (videoTrack) {
          // Add video track to local stream
          localStreamRef.current.addTrack(videoTrack);
          setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
          console.log('📹 Video track added to stream');

          // Replace track in existing peer connections
          connectionsRef.current.forEach((connection) => {
            const peerConnection = connection.peerConnection as RTCPeerConnection | undefined;
            if (peerConnection) {
              const senders = peerConnection.getSenders();
              const videoSender = senders.find(s => s.track?.kind === 'video');
              
              if (videoSender) {
                videoSender.replaceTrack(videoTrack);
              } else {
                peerConnection.addTrack(videoTrack, localStreamRef.current!);
              }
            }
          });
        }
      } else {
        // Turn OFF camera - remove video tracks
        console.log('📹 Turning off camera...');
        const videoTracks = localStreamRef.current.getVideoTracks();
        videoTracks.forEach(track => {
          track.stop();
          localStreamRef.current?.removeTrack(track);
        });
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
        console.log('📹 Video track removed from stream');
      }

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
    } catch (error) {
      console.error('📹 Error toggling video:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setConnectionError('Permiso de cámara denegado. Por favor, permite el acceso a la cámara.');
        } else if (error.name === 'NotFoundError') {
          setConnectionError('No se encontró ninguna cámara. Verifica que esté conectada.');
        } else {
          setConnectionError(`Error de cámara: ${error.message}`);
        }
      }
    }
  }, [isVideoOn, meetingId, userId]);

  useEffect(() => {
    return () => {
      leaveVoiceCall();
    };
  }, [leaveVoiceCall]);

  // Update localStream state when stream changes
  useEffect(() => {
    if (localStreamRef.current) {
      setLocalStream(localStreamRef.current);
    }
  }, [isInCall]);

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

