import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMeetingById, leaveMeeting, deleteMeeting } from '../../utils/meetingService';
import Button from '../../components/Button/Button';
import type { Meeting } from '../../types';
import './MeetingDetails.scss';

/**
 * MeetingDetails page component displaying detailed meeting information
 * Shows meeting info with options to join, leave, or delete
 * @returns {JSX.Element} Meeting details page
 */
export default function MeetingDetails() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [meeting, setMeeting] = useState<Meeting | null>(
    (location.state as { meeting?: Meeting })?.meeting || null
  );
  const [isLoading, setIsLoading] = useState(!meeting);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    /**
     * Loads meeting data from API
     * @returns {Promise<void>} Promise that resolves when meeting is loaded
     */
    const loadMeeting = async () => {
      if (!meetingId || meeting) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getMeetingById(meetingId);
        setMeeting(data);
      } catch (err) {
        console.error('Error loading meeting:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar la reunión');
      } finally {
        setIsLoading(false);
      }
    };

    loadMeeting();
  }, [meetingId, meeting]);

  /**
   * Handles joining the meeting room
   * @returns {void}
   */
  const handleJoinRoom = () => {
    if (!meeting) return;
    
    navigate('/meetings/room', {
      state: {
        meetingId: meeting.meetingId,
        username: user?.name || 'Usuario'
      }
    });
  };

  /**
   * Handles leaving the meeting
   * @returns {Promise<void>} Promise that resolves when leave is complete
   */
  const handleLeaveMeeting = async () => {
    if (!meeting || !user?.uid) return;

    setIsActionLoading(true);
    try {
      await leaveMeeting(meeting.meetingId, user.uid);
      navigate('/explore', { 
        state: { message: 'Has salido de la reunión exitosamente' } 
      });
    } catch (err) {
      console.error('Error leaving meeting:', err);
      alert(err instanceof Error ? err.message : 'Error al salir de la reunión');
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Handles deleting the meeting (only host can delete)
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   */
  const handleDeleteMeeting = async () => {
    if (!meeting || !user?.uid) return;

    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta reunión? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    setIsActionLoading(true);
    try {
      await deleteMeeting(meeting.meetingId, user.uid);
      navigate('/explore', { 
        state: { message: 'Reunión eliminada exitosamente' } 
      });
    } catch (err) {
      console.error('Error deleting meeting:', err);
      alert(err instanceof Error ? err.message : 'Error al eliminar la reunión');
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Formats date string for display
   * @param {string} dateStr - Date string to format
   * @returns {string} Formatted date string (e.g., "lunes, 1 de diciembre de 2024")
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Formats time string for display
   * @param {string} timeStr - Time string in HH:mm format
   * @returns {string} Formatted time string
   */
  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  const isHost = meeting?.hostId === user?.uid;
  const isParticipant = meeting?.participants.includes(user?.uid || '');

  if (isLoading) {
    return (
      <main className="meeting-details" role="main">
        <div className="meeting-details__container">
          <div className="meeting-details__loading">
            <div className="meeting-details__spinner"></div>
            <p>Cargando detalles de la reunión...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !meeting) {
    return (
      <main className="meeting-details" role="main">
        <div className="meeting-details__container">
          <div className="meeting-details__error">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V12C2 16.55 5.84 20.74 12 22C18.16 20.74 22 16.55 22 12V7L12 2ZM11 13V7H13V13H11ZM11 17V15H13V17H11Z" fill="currentColor" opacity="0.3"/>
            </svg>
            <h2>{error || 'Reunión no encontrada'}</h2>
            <Link to="/explore" className="meeting-details__back-btn">
              Volver a Explorar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="meeting-details" role="main">
      <div className="meeting-details__container">
        <div className="meeting-details__header">
          <button 
            onClick={() => navigate(-1)} 
            className="meeting-details__back"
            aria-label="Volver"
          >
            ← Volver
          </button>
          {isHost && (
            <span className="meeting-details__host-badge">Anfitrión</span>
          )}
        </div>

        <div className="meeting-details__card">
          <div className="meeting-details__title-section">
            <h1 className="meeting-details__title">{meeting.title}</h1>
            <span className={`meeting-details__status meeting-details__status--${meeting.status}`}>
              {meeting.status === 'active' ? 'Activa' : meeting.status === 'completed' ? 'Completada' : 'Cancelada'}
            </span>
          </div>

          {meeting.description && (
            <p className="meeting-details__description">{meeting.description}</p>
          )}

          <div className="meeting-details__info-grid">
            <div className="meeting-details__info-card">
              <div className="meeting-details__info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <label>Fecha</label>
                <p>{formatDate(meeting.date)}</p>
              </div>
            </div>

            <div className="meeting-details__info-card">
              <div className="meeting-details__info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <label>Hora</label>
                <p>{formatTime(meeting.time)}</p>
              </div>
            </div>

            <div className="meeting-details__info-card">
              <div className="meeting-details__info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <label>Duración</label>
                <p>{meeting.estimatedDuration} minutos</p>
              </div>
            </div>

            <div className="meeting-details__info-card">
              <div className="meeting-details__info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <label>Participantes</label>
                <p>{meeting.participants.length} / {meeting.maxParticipants}</p>
              </div>
            </div>
          </div>

          <div className="meeting-details__id-section">
            <label>ID de la reunión</label>
            <code>{meeting.meetingId}</code>
          </div>

          <div className="meeting-details__actions">
            <Button
              type="button"
              variant="primary"
              onClick={handleJoinRoom}
              disabled={isActionLoading || meeting.status !== 'active'}
            >
              {meeting.status === 'active' ? 'Unirse a la reunión' : 'Reunión no disponible'}
            </Button>

            {isParticipant && !isHost && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleLeaveMeeting}
                disabled={isActionLoading}
              >
                {isActionLoading ? 'Procesando...' : 'Salir de la reunión'}
              </Button>
            )}

            {isHost && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleDeleteMeeting}
                disabled={isActionLoading}
                className="meeting-details__delete-btn"
              >
                {isActionLoading ? 'Eliminando...' : 'Eliminar reunión'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
