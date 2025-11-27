import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getTodayMeetings } from '../../utils/meetingService';
import type { Meeting } from '../../types';
import './Dashboard.scss';

/**
 * Dashboard page component displaying user welcome message and meeting actions
 * Shows welcome message from location state (e.g., after login or account deletion)
 * @returns {JSX.Element} Dashboard page with greeting and action buttons
 */
export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [todayMeetings, setTodayMeetings] = useState<Meeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);

  useEffect(() => {
    if (location.state?.message) {
      setWelcomeMessage(location.state.message);
      const timer = setTimeout(() => setWelcomeMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const loadTodayMeetings = async () => {
      if (!user?.uid) {
        setIsLoadingMeetings(false);
        return;
      }

      try {
        const response = await getTodayMeetings(user.uid);
        setTodayMeetings(response.data.meetings || []);
      } catch (error) {
        console.error('Error loading today meetings:', error);
      } finally {
        setIsLoadingMeetings(false);
      }
    };

    loadTodayMeetings();
  }, [user?.uid]);

  const handleMeetingClick = (meeting: Meeting) => {
    navigate(`/meetings/${meeting.meetingId}`, { state: { meeting } });
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  return (
    <main className="dashboard" role="main">
      <div className="dashboard__container">
        {welcomeMessage && (
          <div className="dashboard__welcome-message" role="alert">
            {welcomeMessage}
          </div>
        )}
        
        <div className="dashboard__greeting">
          <h1 className="dashboard__title">
            Hola, {user?.name || 'Usuario'}
          </h1>
          <p className="dashboard__subtitle">
            Gestiona tus reuniones y conecta con tu equipo
          </p>
        </div>

        <div className="dashboard__actions">
          <Link to="/meetings/create" className="dashboard__button dashboard__button--primary">
            <svg 
              className="dashboard__button-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 4V16M4 10H16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
            <span>Nueva reunión</span>
          </Link>
          
          <Link to="/meetings/join" className="dashboard__button dashboard__button--secondary">
            <svg 
              className="dashboard__button-icon dashboard__button-icon--secondary" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 4V16M4 10H16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
            <span>Unirse a una reunión</span>
          </Link>
        </div>

        <section className="dashboard__meetings">
          <h2 className="dashboard__meetings-title">Próximas reuniones</h2>
          {isLoadingMeetings ? (
            <div className="dashboard__meetings-loading">
              <div className="dashboard__meetings-spinner"></div>
              <p>Cargando reuniones...</p>
            </div>
          ) : todayMeetings.length === 0 ? (
            <div className="dashboard__meetings-empty">
              <p>No tienes reuniones programadas para hoy</p>
              <Link to="/meetings/create" className="dashboard__meetings-create-link">
                Crear una reunión
              </Link>
            </div>
          ) : (
            <div className="dashboard__meetings-list">
              {todayMeetings.map(meeting => (
                <div 
                  key={meeting.meetingId}
                  className="dashboard__meeting-item"
                  onClick={() => handleMeetingClick(meeting)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="dashboard__meeting-time">{formatTime(meeting.time)}</div>
                  <div className="dashboard__meeting-info">
                    <div className="dashboard__meeting-name">{meeting.title}</div>
                    {meeting.description && (
                      <div className="dashboard__meeting-description">{meeting.description}</div>
                    )}
                  </div>
                  <div className="dashboard__meeting-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

