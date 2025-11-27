import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button/Button';
import type { Meeting } from '../../types';
import './MeetingSuccess.scss';

interface LocationState {
  meeting?: Meeting;
  isJoining?: boolean;
}

/**
 * MeetingSuccess page component displaying meeting creation/join confirmation
 * Shows meeting details including the generated meeting ID
 * @returns {JSX.Element} Meeting success page with meeting information
 */
export default function MeetingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as LocationState;
  const [meeting] = useState<Meeting | null>(state?.meeting || null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(!state?.meeting);
  const isJoining = state?.isJoining || false;

  useEffect(() => {
    // Si no hay información de reunión después de un delay, redirigir al explore
    if (!meeting) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        navigate('/explore', { replace: true });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [meeting, navigate]);

  // Mostrar estado de carga mientras se verifica
  if (isLoading && !meeting) {
    return (
      <main className="meeting-success" role="main">
        <div className="meeting-success__container">
          <div className="meeting-success__loading">
            <h2>Cargando información de la reunión...</h2>
            <p>Un momento por favor...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!meeting) {
    return null;
  }

  const handleCopyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(meeting.meetingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleJoinRoom = () => {
    // Navegar a la sala de videoconferencia con datos del usuario
    navigate('/meetings/room', { 
      state: { 
        meetingId: meeting.meetingId,
        username: user?.name || 'Usuario'
      },
      replace: true 
    });
  };

  const handleGoToDashboard = () => {
    navigate('/explore');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr; // Ya viene en formato HH:mm
  };

  return (
    <main className="meeting-success" role="main">
      <div className="meeting-success__container">
        <div className="meeting-success__icon">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="meeting-success__title">
          {isJoining ? '¡Te has unido exitosamente!' : '¡Reunión creada exitosamente!'}
        </h1>

        <p className="meeting-success__subtitle">
          {isJoining 
            ? 'Ahora puedes ingresar a la sala de reunión' 
            : 'Tu reunión ha sido creada y está lista para iniciar'}
        </p>

        <div className="meeting-success__details">
          <div className="meeting-success__detail-card">
            <h2 className="meeting-success__detail-title">Detalles de la reunión</h2>
            
            <div className="meeting-success__detail-group">
              <label className="meeting-success__detail-label">Título</label>
              <p className="meeting-success__detail-value">{meeting.title}</p>
            </div>

            {meeting.description && (
              <div className="meeting-success__detail-group">
                <label className="meeting-success__detail-label">Descripción</label>
                <p className="meeting-success__detail-value">{meeting.description}</p>
              </div>
            )}

            <div className="meeting-success__detail-row">
              <div className="meeting-success__detail-group">
                <label className="meeting-success__detail-label">Fecha</label>
                <p className="meeting-success__detail-value">
                  {formatDate(meeting.date)}
                </p>
              </div>

              <div className="meeting-success__detail-group">
                <label className="meeting-success__detail-label">Hora</label>
                <p className="meeting-success__detail-value">
                  {formatTime(meeting.time)}
                </p>
              </div>
            </div>

            <div className="meeting-success__detail-row">
              <div className="meeting-success__detail-group">
                <label className="meeting-success__detail-label">Duración estimada</label>
                <p className="meeting-success__detail-value">
                  {meeting.estimatedDuration} minutos
                </p>
              </div>

              <div className="meeting-success__detail-group">
                <label className="meeting-success__detail-label">Participantes</label>
                <p className="meeting-success__detail-value">
                  {meeting.participants.length} / {meeting.maxParticipants}
                </p>
              </div>
            </div>

            <div className="meeting-success__meeting-id">
              <label className="meeting-success__detail-label">ID de la reunión</label>
              <div className="meeting-success__id-container">
                <code className="meeting-success__id-code">{meeting.meetingId}</code>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCopyMeetingId}
                  className="meeting-success__copy-button"
                  aria-label="Copiar ID de reunión"
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </Button>
              </div>
              <small className="meeting-success__id-hint">
                Comparte este ID con los participantes para que puedan unirse
              </small>
            </div>
          </div>

          <div className="meeting-success__info-card">
            <h3 className="meeting-success__info-title">
              {isJoining ? '¿Listo para unirte?' : '¿Qué sigue?'}
            </h3>
            <ul className="meeting-success__info-list">
              {!isJoining && (
                <>
                  <li>Comparte el ID de la reunión con los participantes</li>
                  <li>Los participantes pueden unirse usando el ID</li>
                </>
              )}
              <li>Haz clic en "Ir a la sala" para ingresar a la videollamada</li>
              <li>Asegúrate de que tu cámara y micrófono estén funcionando</li>
            </ul>
          </div>
        </div>

        <div className="meeting-success__actions">
          <Button
            type="button"
            variant="primary"
            onClick={handleJoinRoom}
            className="meeting-success__join-button"
          >
            Ir a la sala
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleGoToDashboard}
            className="meeting-success__dashboard-button"
          >
            Volver al dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
