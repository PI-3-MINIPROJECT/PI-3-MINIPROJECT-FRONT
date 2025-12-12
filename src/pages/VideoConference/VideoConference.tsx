import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
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
  const mountedRef = useRef(true);
  const cleanupTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    mountedRef.current = true;
    
    // Clear any pending cleanup from previous mount
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
    
    joinVoiceCall();
    
    return () => {
      // Mark as unmounted
      mountedRef.current = false;
      
      // Clear any existing timeout
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      
      // Use a delay to distinguish between StrictMode cleanup and real unmount
      // In StrictMode, the component will remount quickly, so we check after a delay
      cleanupTimeoutRef.current = setTimeout(() => {
        // Only cleanup if component is still unmounted (real unmount, not StrictMode)
        if (!mountedRef.current) {
          void leaveVoiceCall();
        }
        cleanupTimeoutRef.current = null;
      }, 200); // Increased delay to better handle StrictMode
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

    return allUsers.map((usr) => {
      const stream = usr.userId === usrId ? localStream : getRemoteStream(usr.userId);
      
      // For remote users, check if they have an active video track in their stream
      let hasActiveVideo = false;
      if (usr.userId === usrId) {
        hasActiveVideo = isVideoOn;
      } else {
        // Check voice participants status
        const videoStatus = getUserVideoStatus(usr.userId);
        // Also verify if stream has active video tracks
        const hasVideoTrack = stream?.getVideoTracks().some(track => track.enabled) ?? false;
        hasActiveVideo = videoStatus || hasVideoTrack;
      }

      return {
        id: usr.userId,
        name: usr.username,
        initials: getUserInitials(usr.username),
        isCameraOn: hasActiveVideo,
        isMuted: usr.userId === usrId ? isMuted : getUserMuteStatus(usr.userId),
        stream: stream,
      };
    });
  }, [onlineUsers, usrId, usrName, isMuted, isVideoOn, localStream, getUserMuteStatus, getUserVideoStatus, getRemoteStream]);

  /**
   * Handles ending the call and navigating back to explore page
   * @returns {void}
   */
  const handleEndCall = () => {
    // Show confirmation if there are other participants
    if (participants.length > 1) {
      setShowExitConfirm(true);
    } else {
      confirmEndCall();
    }
  };

  /**
   * Confirms ending the call and navigates back
   * @returns {Promise<void>}
   */
  const confirmEndCall = async () => {
    await leaveVoiceCall();
    navigate('/explore');
  };

  /**
   * Cancels ending the call
   * @returns {void}
   */
  const cancelEndCall = () => {
    setShowExitConfirm(false);
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
      {/* Breadcrumbs Navigation */}
      <nav className="video-conference__breadcrumbs" aria-label="Navegación de ruta">
        <Link to="/explore" className="video-conference__breadcrumb-link">
          Inicio
        </Link>
        <span className="video-conference__breadcrumb-separator">/</span>
        <span className="video-conference__breadcrumb-current" aria-current="page">
          Sala de Reunión
        </span>
      </nav>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <>
          <div className="video-conference__modal-overlay" onClick={cancelEndCall} />
          <div className="video-conference__modal" role="dialog" aria-labelledby="exit-dialog-title" aria-describedby="exit-dialog-desc">
            <h2 id="exit-dialog-title" className="video-conference__modal-title">¿Salir de la reunión?</h2>
            <p id="exit-dialog-desc" className="video-conference__modal-description">
              Hay otras personas en la sala. Si sales, dejarás de verlas y escucharlas.
            </p>
            <div className="video-conference__modal-actions">
              <button
                type="button"
                className="video-conference__modal-button video-conference__modal-button--cancel"
                onClick={cancelEndCall}
                autoFocus
              >
                Quedarme en la sala
              </button>
              <button
                type="button"
                className="video-conference__modal-button video-conference__modal-button--confirm"
                onClick={confirmEndCall}
              >
                Sí, salir de la reunión
              </button>
            </div>
          </div>
        </>
      )}

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

          <div className="video-conference__controls" role="toolbar" aria-label="Controles de videoconferencia">
          <button
            type="button"
            className={`video-conference__control-button ${!isMuted ? 'video-conference__control-button--active' : ''}`}
            onClick={handleMicToggle}
            aria-label={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
            aria-pressed={!isMuted}
            title={isMuted ? '🎤 Activar tu micrófono' : '🔇 Silenciar tu micrófono'}
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
            aria-pressed={isVideoOn}
            title={isVideoOn ? '📹 Apagar tu cámara' : '📷 Encender tu cámara'}
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
            title="🖥️ Compartir tu pantalla con otros"
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
            aria-pressed={showChat}
            title={showChat ? '💬 Ocultar mensajes del chat' : '💬 Abrir chat para conversar'}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className={`video-conference__control-button ${showParticipants ? 'video-conference__control-button--active' : ''}`}
            onClick={() => setShowParticipants(!showParticipants)}
            aria-label={showParticipants ? 'Ocultar participantes' : 'Ver participantes'}
            aria-pressed={showParticipants}
            title={showParticipants ? '👥 Ocultar lista de participantes' : '👥 Ver quién está en la reunión'}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 0 14.17 0 16.5V19H16V16.5C16 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H24V16.5C24 14.17 18.33 13 16 13Z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className="video-conference__control-button video-conference__control-button--end"
            onClick={handleEndCall}
            aria-label="Colgar y salir de la reunión"
            title="📞 Colgar y salir de la reunión"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" transform="rotate(135 12 12)"/>
            </svg>
          </button>
          </div>
        </div>

        {/* Participants Panel */}
        {showParticipants && (
          <>
            <div 
              className="video-conference__participants-overlay"
              onClick={() => setShowParticipants(false)}
              aria-label="Cerrar panel de participantes"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowParticipants(false);
                }
              }}
            />
            <div className="video-conference__participants-panel" role="complementary" aria-label="Lista de participantes">
              <div className="video-conference__participants-header">
                <h3>Participantes ({participants.length})</h3>
                <button
                  type="button"
                  className="video-conference__participants-close"
                  onClick={() => setShowParticipants(false)}
                  aria-label="Cerrar panel"
                  title="Cerrar lista de participantes"
                >
                  ✕
                </button>
              </div>
              <ul className="video-conference__participants-list">
                {participants.map((participant) => (
                  <li key={participant.id} className="video-conference__participant-item">
                    <div className="video-conference__participant-avatar">
                      <span className="video-conference__participant-initials">
                        {participant.initials}
                      </span>
                    </div>
                    <div className="video-conference__participant-info">
                      <span className="video-conference__participant-name-text">
                        {participant.name}
                        {participant.id === usrId && ' (tú)'}
                      </span>
                      <div className="video-conference__participant-status">
                        <span className={`video-conference__participant-badge ${!participant.isMuted ? 'video-conference__participant-badge--active' : ''}`}>
                          {participant.isMuted ? '🔇 Silenciado' : '🎤 Hablando'}
                        </span>
                        <span className={`video-conference__participant-badge ${participant.isCameraOn ? 'video-conference__participant-badge--active' : ''}`}>
                          {participant.isCameraOn ? '📹 Cámara' : '📷 Sin cámara'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

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
