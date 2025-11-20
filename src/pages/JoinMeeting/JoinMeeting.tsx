import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './JoinMeeting.scss';

export default function JoinMeeting() {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState('');
  const [errors, setErrors] = useState<{ meetingId?: string }>({});
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

    setIsJoining(true);
    try {
      console.log('Unirse a reunión:', { meetingId });
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Aquí iría la lógica para unirse a la reunión
      navigate('/meetings/room');
    } catch (error) {
      console.error('Error al unirse a la reunión:', error);
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

