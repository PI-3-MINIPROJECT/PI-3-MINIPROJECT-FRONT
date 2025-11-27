import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { createMeeting } from '../../utils/meetingService';
import type { Meeting } from '../../types';
import './CreateMeeting.scss';

/**
 * CreateMeeting page component for creating a new video conference meeting
 * Allows users to set meeting details and navigate to the meeting room
 * @returns {JSX.Element} Create meeting page with meeting configuration form
 */
export default function CreateMeeting() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:30');
  const [duration, setDuration] = useState('45');
  const [maxParticipants, setMaxParticipants] = useState('10');
  const [errors, setErrors] = useState<{ 
    title?: string; 
    date?: string; 
    time?: string;
    duration?: string;
    maxParticipants?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { 
      title?: string; 
      date?: string; 
      time?: string;
      duration?: string;
      maxParticipants?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = 'El título de la reunión es requerido';
    }

    if (!date.trim()) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!time.trim()) {
      newErrors.time = 'La hora es requerida';
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum < 5) {
      newErrors.duration = 'La duración mínima es 5 minutos';
    }

    const maxParticipantsNum = parseInt(maxParticipants);
    if (isNaN(maxParticipantsNum) || maxParticipantsNum < 2) {
      newErrors.maxParticipants = 'Mínimo 2 participantes';
    } else if (maxParticipantsNum > 50) {
      newErrors.maxParticipants = 'Máximo 50 participantes';
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
      setErrors({ general: 'Debes iniciar sesión para crear una reunión' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      const meetingData = {
        userId: user.uid,
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        time,
        estimatedDuration: parseInt(duration),
        maxParticipants: parseInt(maxParticipants),
      };

      const createdMeeting: Meeting = await createMeeting(meetingData);
      
      // Redirigir a la página de éxito con los datos de la reunión
      navigate('/meetings/success', { 
        state: { meeting: createdMeeting },
        replace: true 
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
      setErrors({ 
        general: error instanceof Error 
          ? error.message 
          : 'No se pudo crear la reunión. Intenta nuevamente.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-meeting" role="main">
      <div className="create-meeting__container">
        <div className="create-meeting__header">
          <h1 className="create-meeting__title">
            Crear <span className="create-meeting__title-highlight">reunión</span>
          </h1>
          <p className="create-meeting__subtitle">
            Configura tu videollamada y comienza a conectar
          </p>
        </div>

        {errors.general && (
          <div className="create-meeting__error-banner" role="alert">
            {errors.general}
          </div>
        )}

        <form className="create-meeting__form" onSubmit={handleSubmit}>
          <div className="create-meeting__form-group">
            <Input
              id="title"
              type="text"
              label="Título de la reunión"
              placeholder="e.g. Reunión de equipo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
            />
          </div>

          <div className="create-meeting__form-group">
            <label className="create-meeting__label" htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              className="create-meeting__textarea"
              placeholder="Agrega una descripción para tu reunión"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="create-meeting__form-row">
            <div className="create-meeting__form-group">
              <Input
                id="date"
                type="date"
                label="Fecha"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                error={errors.date}
                required
              />
            </div>

            <div className="create-meeting__form-group">
              <Input
                id="time"
                type="time"
                label="Hora"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                error={errors.time}
                required
              />
            </div>
          </div>

          <div className="create-meeting__form-row">
            <div className="create-meeting__form-group">
              <Input
                id="duration"
                type="number"
                label="Duración estimada (minutos)"
                placeholder="45"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                error={errors.duration}
                min="5"
                max="480"
              />
            </div>

            <div className="create-meeting__form-group">
              <Input
                id="maxParticipants"
                type="number"
                label="Máximo de participantes"
                placeholder="10"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                error={errors.maxParticipants}
                min="2"
                max="50"
              />
            </div>
          </div>

          <div className="create-meeting__actions">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="create-meeting__submit-button"
            >
              {isSubmitting ? 'Creando...' : 'Crear reunión'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

