import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { useVoiceCall } from '../../hooks/useVoiceCall';
import ChatRoom from '../../components/ChatRoom/ChatRoom';
import './VideoConference.scss';

/**
 * VideoConference page component displaying the video conference interface
 * Shows participants, chat panel, and control buttons (mic, camera, etc.)
 * Integrates real-time chat and voice call functionality
 * @returns {JSX.Element} Video conference page with meeting interface
 */
export default function VideoConference() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const meetingData = location.state as { meetingId?: string; username?: string } | null;
  const meetingId = meetingData?.meetingId || 'demo-meeting';
  const usrId = user?.uid || 'demo-user';
  const usrName = meetingData?.username || user?.name || 'Usuario';

  const { onlineUsers } = useChat(meetingId, usrId, usrName);

  const {
    isMuted,
    isVideoOn,
    participants: voiceParticipants,
    connectionError: callError,
    isInCall,
    localStream,
    remoteStreams,
    toggleMute,
    toggleVideo,
    joinVoiceCall,
    leaveVoiceCall,
  } = useVoiceCall(meetingId, usrId, usrName);

  /**
   * Join call when component mounts
   */
  useEffect(() => {
    joinVoiceCall();
    
    return () => {
      leaveVoiceCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount/unmount

  /**
   * Update local video element when stream changes
   */
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  /**
   * Gets user initials from name
   * @param {string} name - User full name
   * @returns {string} User initials (e.g., "JG" for John Green)
   */
  const getUserInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  /**
   * Get mute status for a user from voice participants
   * @param {string} oderId - User ID
   * @returns {boolean} Whether user is muted
   */
  const getUserMuteStatus = useCallback((oderId: string): boolean => {
    const voiceUser = voiceParticipants.find(p => p.userId === oderId);
    return voiceUser?.isMuted ?? true;
  }, [voiceParticipants]);

  /**
   * Get video status for a user from voice participants
   * @param {string} oderId - User ID
   * @returns {boolean} Whether user has video on
   */
  const getUserVideoStatus = useCallback((oderId: string): boolean => {
    const voiceUser = voiceParticipants.find(p => p.userId === oderId);
    return voiceUser?.isVideoOn ?? false;
  }, [voiceParticipants]);

  /**
   * Get remote stream for a user
   * @param {string} oderId - User ID
   * @returns {MediaStream | undefined} Remote stream
   */
  const getRemoteStream = useCallback((oderId: string): MediaStream | undefined => {
    return remoteStreams.get(oderId);
  }, [remoteStreams]);

  const participants = useMemo(() => {
    const allUsers = [...onlineUsers];
    
    const currentUserInList = allUsers.find(u => u.userId === usrId);
    if (!currentUserInList) {
      allUsers.push({
        userId: usrId,
        username: usrName,
        joinedAt: new Date().toISOString()
      });
    }

    return allUsers.map((usr) => ({
      id: usr.userId,
      name: usr.username,
      initials: getUserInitials(usr.username),
      isCameraOn: usr.userId === usrId ? isVideoOn : getUserVideoStatus(usr.userId),
      isMuted: usr.userId === usrId ? isMuted : getUserMuteStatus(usr.userId),
      stream: usr.userId === usrId ? localStream : getRemoteStream(usr.userId),
    }));
  }, [onlineUsers, usrId, usrName, isMuted, isVideoOn, localStream, getUserMuteStatus, getUserVideoStatus, getRemoteStream]);

  /**
   * Handles ending the call and navigating back to explore page
   * @returns {void}
   */
  const handleEndCall = () => {
    leaveVoiceCall();
    navigate('/explore');
  };

  /**
   * Handle microphone toggle
   */
  const handleMicToggle = () => {
    toggleMute();
  };

  /**
   * Handle camera toggle
   */
  const handleCameraToggle = () => {
    toggleVideo();
  };

  /**
   * Video element component for participant
   */
  const ParticipantVideo = ({ stream, muted = false }: { stream: MediaStream | null | undefined; muted?: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    if (!stream) return null;

    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="video-conference__video-element"
      />
    );
  };

  return (
    <div className="video-conference">
      {/* Connecting indicator */}
      {!isInCall && !callError && (
        <div className="video-conference__connecting">
          <div className="video-conference__connecting-spinner"></div>
          <span>Conectando... Por favor, permite el acceso a la cámara y micrófono</span>
        </div>
      )}

      {/* Call connection error */}
      {callError && (
        <div className="video-conference__error">
          <span>⚠️ {callError}</span>
        </div>
      )}

      <div className="video-conference__container">
        <div className="video-conference__main">
          <div className="video-conference__video-area">
            <div className="video-conference__participants">
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <div key={participant.id} className={`video-conference__participant ${participant.isCameraOn ? 'video-conference__participant--with-video' : ''}`}>
                    {participant.isCameraOn && participant.stream ? (
                      <div className="video-conference__video-container">
                        <ParticipantVideo stream={participant.stream} muted={participant.id === usrId} />
                        <div className="video-conference__video-overlay">
                          <span className="video-conference__participant-name-overlay">
                            {participant.name}
                            {participant.id === usrId && ' (tú)'}
                          </span>
                          {participant.isMuted && (
                            <span className="video-conference__mute-indicator-video" title="Silenciado">
                              🔇
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="video-conference__avatar">
                          <span className="video-conference__avatar-initials">{participant.initials}</span>
                          {participant.isMuted && (
                            <span className="video-conference__mute-indicator" title="Silenciado">
                              🔇
                            </span>
                          )}
                        </div>
                        <div className="video-conference__participant-name">
                          {participant.name}
                          {participant.id === usrId && ' (tú)'}
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="video-conference__participant">
                  <div className="video-conference__avatar">
                    <span className="video-conference__avatar-initials">{getUserInitials(usrName)}</span>
                    {isMuted && (
                      <span className="video-conference__mute-indicator" title="Silenciado">
                        🔇
                      </span>
                    )}
                  </div>
                  <div className="video-conference__participant-name">{usrName} (tú)</div>
                </div>
              )}
            </div>
          </div>

          <div className="video-conference__controls">
          <button
            type="button"
            className={`video-conference__control-button ${!isMuted ? 'video-conference__control-button--active' : ''}`}
            onClick={handleMicToggle}
            aria-label={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
            disabled={!isInCall}
          >
            {!isMuted ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" fill="currentColor"/>
                <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H7V12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12V10H19Z" fill="currentColor"/>
                <path d="M12 19V23H8V21H12V19Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" fill="currentColor"/>
                <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H7V12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12V10H19Z" fill="currentColor"/>
                <path d="M12 19V23H8V21H12V19Z" fill="currentColor"/>
                <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          <button
            type="button"
            className={`video-conference__control-button video-conference__control-button--camera ${isVideoOn ? 'video-conference__control-button--active' : ''}`}
            onClick={handleCameraToggle}
            aria-label={isVideoOn ? 'Apagar cámara' : 'Encender cámara'}
            disabled={!isInCall}
          >
            {isVideoOn ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
                <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="video-conference__control-button"
            aria-label="Compartir pantalla"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16Z" fill="currentColor"/>
              <path d="M13 13H19V11H13V13ZM11 9H19V7H11V9Z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className={`video-conference__control-button ${showChat ? 'video-conference__control-button--active' : ''}`}
            onClick={() => setShowChat(!showChat)}
            aria-label={showChat ? 'Ocultar chat' : 'Mostrar chat'}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className="video-conference__control-button"
            aria-label="Participantes"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 0 14.17 0 16.5V19H16V16.5C16 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H24V16.5C24 14.17 18.33 13 16 13Z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className="video-conference__control-button video-conference__control-button--end"
            onClick={handleEndCall}
            aria-label="Finalizar llamada"
            title="Salir de la llamada"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87.12-2.42-.41L2.2 10.72C1.26 9.58.8 10.53.8 11.5v1c0 5.52 4.48 10 10 10h.4c5.52 0 10-4.48 10-10v-1c0-.97-.46-1.92-1.4-.78l-2.22 2.59c-.55.53-1.44.9-2.42.41a.994.994 0 0 1-.56-.9v-3.1A14.93 14.93 0 0 0 12 9z" fill="currentColor"/>
              <path d="M19 3.5L5 17.5M5 3.5l14 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
          </div>
        </div>

        {showChat && (
          <div 
            className="video-conference__chat-overlay"
            onClick={() => setShowChat(false)}
            aria-label="Cerrar chat"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowChat(false);
              }
            }}
          />
        )}
        <div className={`video-conference__chat ${showChat ? 'video-conference__chat--visible' : 'video-conference__chat--hidden'}`}>
          <ChatRoom
            meetingId={meetingId}
            userId={usrId}
            username={usrName}
            onClose={() => setShowChat(false)}
          />
        </div>
      </div>
    </div>
  );
}
