import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserMeetings } from '../../utils/meetingService';
import { getErrorMessage } from '../../utils/errorMessages';
import type { Meeting } from '../../types';
import './MyMeetings.scss';

/**
 * MyMeetings page component displaying all user's meetings
 * Shows meetings created by the user and meetings they've joined
 * @returns {JSX.Element} My meetings page with meeting list
 */
export default function MyMeetings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'host' | 'participant'>('all');

  useEffect(() => {
    const loadMeetings = async () => {
      if (!user?.uid) {
        setError('Debes iniciar sesión para ver tus reuniones');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getUserMeetings(user.uid);
        
        let meetingsData: Meeting[] = [];
        if (Array.isArray(response.data)) {
          meetingsData = response.data;
        } else if (response.data && typeof response.data === 'object' && 'meetings' in response.data && Array.isArray(response.data.meetings)) {
          meetingsData = response.data.meetings;
        }
        
        setMeetings(meetingsData);
      } catch (err) {
        console.error('❌ Error loading meetings:', err);
        const errorDetails = getErrorMessage(err);
        setError(errorDetails.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMeetings();
  }, [user?.uid]);

  const filteredMeetings = meetings.filter(meeting => {
    if (filter === 'host') return meeting.hostId === user?.uid;
    if (filter === 'participant') return meeting.hostId !== user?.uid;
    return true;
  });

  const handleMeetingClick = (meeting: Meeting) => {
    navigate(`/meetings/${meeting.meetingId}`, { state: { meeting } });
  };

  /**
   * Formats date string for display
   * @param {string} dateStr - Date string to format
   * @returns {string} Formatted date string (e.g., "lun, 1 dic")
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
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

  /**
   * Gets color class name for meeting status
   * @param {string} status - Meeting status ('active', 'completed', 'cancelled')
   * @returns {string} Color class name
   */
  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'gray';
      case 'cancelled': return 'red';
      default: return 'blue';
    }
  };

  return (
    <main className="my-meetings" role="main">
      <div className="my-meetings__container">
        <div className="my-meetings__header">
          <h1 className="my-meetings__title">
            Mis <span className="my-meetings__title-highlight">Reuniones</span>
          </h1>
          <p className="my-meetings__subtitle">
            Gestiona todas tus reuniones en un solo lugar
          </p>
        </div>

        <div className="my-meetings__filters">
          <button
            className={`my-meetings__filter-btn ${filter === 'all' ? 'my-meetings__filter-btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({meetings.length})
          </button>
          <button
            className={`my-meetings__filter-btn ${filter === 'host' ? 'my-meetings__filter-btn--active' : ''}`}
            onClick={() => setFilter('host')}
          >
            Como anfitrión ({meetings.filter(m => m.hostId === user?.uid).length})
          </button>
          <button
            className={`my-meetings__filter-btn ${filter === 'participant' ? 'my-meetings__filter-btn--active' : ''}`}
            onClick={() => setFilter('participant')}
          >
            Como participante ({meetings.filter(m => m.hostId !== user?.uid).length})
          </button>
        </div>

        {error && (
          <div className="my-meetings__error" role="alert">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V12C2 16.55 5.84 20.74 12 22C18.16 20.74 22 16.55 22 12V7L12 2ZM11 13V7H13V13H11ZM11 17V15H13V17H11Z" fill="currentColor"/>
            </svg>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="my-meetings__loading">
            <div className="my-meetings__spinner"></div>
            <p>Cargando reuniones...</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="my-meetings__empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor" opacity="0.3"/>
            </svg>
            <h2>No hay reuniones</h2>
            <p>
              {filter === 'all' 
                ? 'Aún no tienes reuniones. ¡Crea tu primera reunión!'
                : filter === 'host'
                ? 'No has creado ninguna reunión aún'
                : 'No te has unido a ninguna reunión aún'}
            </p>
            <Link to="/meetings/create" className="my-meetings__create-btn">
              Crear nueva reunión
            </Link>
          </div>
        ) : (
          <div className="my-meetings__list">
            {filteredMeetings.map(meeting => (
              <div 
                key={meeting.meetingId} 
                className="my-meetings__card"
                onClick={() => handleMeetingClick(meeting)}
                role="button"
                tabIndex={0}
              >
                <div className="my-meetings__card-header">
                  <div className="my-meetings__card-title-section">
                    <h3 className="my-meetings__card-title">{meeting.title}</h3>
                    <span className={`my-meetings__card-status my-meetings__card-status--${getMeetingStatusColor(meeting.status)}`}>
                      {meeting.status === 'active' ? 'Activa' : meeting.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </span>
                  </div>
                  {meeting.hostId === user?.uid && (
                    <span className="my-meetings__card-badge">Anfitrión</span>
                  )}
                </div>

                {meeting.description && (
                  <p className="my-meetings__card-description">{meeting.description}</p>
                )}

                <div className="my-meetings__card-info">
                  <div className="my-meetings__card-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="currentColor"/>
                    </svg>
                    <span>{formatDate(meeting.date)}</span>
                  </div>

                  <div className="my-meetings__card-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="currentColor"/>
                    </svg>
                    <span>{formatTime(meeting.time)}</span>
                  </div>

                  <div className="my-meetings__card-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
                    </svg>
                    <span>{meeting.participants.length} / {meeting.maxParticipants}</span>
                  </div>

                  <div className="my-meetings__card-info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7Z" fill="currentColor"/>
                    </svg>
                    <span>{meeting.estimatedDuration} min</span>
                  </div>
                </div>

                <div className="my-meetings__card-footer">
                  <span className="my-meetings__card-id">ID: {meeting.meetingId}</span>
                  <button className="my-meetings__card-btn">
                    Ver detalles →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
