import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ChatRoom from '../../components/ChatRoom/ChatRoom';
import './VideoConference.scss';

/**
 * VideoConference page component displaying the video conference interface
 * Shows participants, chat panel, and control buttons (mic, camera, etc.)
 * @returns {JSX.Element} Video conference page with meeting interface
 */
export default function VideoConference() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const meetingData = location.state as { meetingId?: string; username?: string } | null;
  const meetingId = meetingData?.meetingId || 'demo-meeting';
  const userId = user?.uid || 'demo-user';
  const username = meetingData?.username || user?.name || 'Usuario';

  const participants = [
    { id: 1, name: 'John Green', initials: 'JG', isCameraOn: false },
    { id: 2, name: 'María López', initials: 'ML', isCameraOn: false },
    { id: 3, name: 'Carlos Ruiz', initials: 'CR', isCameraOn: false },
    { id: 4, name: 'Ana García', initials: 'AG', isCameraOn: false },
  ];

  /**
   * Handles ending the video call and navigating back to explore page
   * @returns {void}
   */
  const handleEndCall = () => {
    navigate('/explore');
  };

  return (
    <div className="video-conference">
      <div className="video-conference__main">
        <div className="video-conference__video-area">
          <div className="video-conference__participants">
            {participants.map((participant) => (
              <div key={participant.id} className="video-conference__participant">
                <div className="video-conference__avatar">
                  <span className="video-conference__avatar-initials">{participant.initials}</span>
                </div>
                <div className="video-conference__participant-name">{participant.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="video-conference__controls">
          <button
            type="button"
            className={`video-conference__control-button ${isMicOn ? 'video-conference__control-button--active' : ''}`}
            onClick={() => setIsMicOn(!isMicOn)}
            aria-label={isMicOn ? 'Silenciar micrófono' : 'Activar micrófono'}
          >
            {isMicOn ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" fill="currentColor"/>
                <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H7V12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12V10H19Z" fill="currentColor"/>
                <path d="M12 19V23H8V21H12V19Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" fill="currentColor"/>
                <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H7V12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12V10H19Z" fill="currentColor"/>
                <path d="M12 19V23H8V21H12V19Z" fill="currentColor"/>
                <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          <button
            type="button"
            className={`video-conference__control-button video-conference__control-button--camera ${isCameraOn ? 'video-conference__control-button--active' : ''}`}
            onClick={() => setIsCameraOn(!isCameraOn)}
            aria-label={isCameraOn ? 'Apagar cámara' : 'Encender cámara'}
          >
            {isCameraOn ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className="video-conference__control-button"
            aria-label="Participantes"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 0 14.17 0 16.5V19H16V16.5C16 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H24V16.5C24 14.17 18.33 13 16 13Z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className="video-conference__control-button video-conference__control-button--end"
            onClick={handleEndCall}
            aria-label="Finalizar llamada"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9C10.4 9 8.85 9.25 7.4 9.72V12.82C7.4 13.41 7.07 13.94 6.5 14.18C5.93 14.42 5.27 14.25 4.85 13.78L2.22 10.72C1.27 9.58 0 10.12 0 11.5V20.5C0 21.88 1.27 22.42 2.22 21.28L4.85 18.22C5.27 17.75 5.93 17.58 6.5 17.82C7.07 18.06 7.4 18.59 7.4 19.18V22.28C8.85 22.75 10.4 23 12 23C17.5 23 22 18.5 22 13C22 7.5 17.5 3 12 3V9Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {showChat && (
        <div className="video-conference__chat">
          <ChatRoom
            meetingId={meetingId}
            userId={userId}
            username={username}
          />
        </div>
      )}
    </div>
  );
}

