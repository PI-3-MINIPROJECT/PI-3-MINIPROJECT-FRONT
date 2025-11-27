import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { joinMeeting } from '../../utils/meetingService';
import './JoinMeeting.scss';

/**
 * JoinMeeting page component for joining a video conference by meeting ID
 * Validates meeting ID and navigates to the meeting room
 * @returns {JSX.Element} Join meeting page with meeting ID input form
 */
export default function JoinMeeting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetingId, setMeetingId] = useState('');
  const [errors, setErrors] = useState<{ meetingId?: string; general?: string }>({});
  const [isJoining, setIsJoining] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { meetingId?: string } = {};

    if (!meetingId.trim()) {
      newErrors.meetingId = 'El ID de la reunión es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user?.uid) {
      setErrors({ general: 'Debes iniciar sesión para unirte a una reunión' });
      return;
    }

    setIsJoining(true);
    setErrors({});
    
    try {
      const meeting = await joinMeeting(meetingId.trim(), user.uid);
      
      // Redirigir a la sala de reunión o a la página de éxito
      navigate('/meetings/success', { 
        state: { meeting, isJoining: true },
        replace: true 
      });
    } catch (error) {
      console.error('Error joining meeting:', error);
      setErrors({ 
        general: error instanceof Error 
          ? error.message 
          : 'No se pudo unir a la reunión. Verifica el ID e intenta más tarde.' 
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="join-meeting" role="main">
      <div className="join-meeting__container">
        <div className="join-meeting__header">
          <h1 className="join-meeting__title">
            Unirse a una <span className="join-meeting__title-highlight">reunión</span>
          </h1>
          <p className="join-meeting__subtitle">
            Ingresa el ID de la reunión para unirte
          </p>
        </div>

        {errors.general && (
          <div className="join-meeting__error-banner" role="alert">
            {errors.general}
          </div>
        )}

        <form className="join-meeting__form" onSubmit={handleSubmit}>
          <div className="join-meeting__form-group">
            <Input
              id="meetingId"
              type="text"
              label="ID de la reunión"
              placeholder="e.g. 5f3a91e2"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              error={errors.meetingId}
              required
            />
          </div>

          <div className="join-meeting__actions">
            <Button
              type="submit"
              variant="primary"
              disabled={isJoining}
              className="join-meeting__submit-button"
            >
              {isJoining ? 'Uniéndose...' : 'Unirse a la reunión'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/explore')}
              className="join-meeting__cancel-button"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

