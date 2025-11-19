import { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './CreateMeeting.scss';

export default function CreateMeeting() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:30');
  const [duration, setDuration] = useState('45 minutos');
  const [maxParticipants, setMaxParticipants] = useState('10 participantes');
  const [meetingId, setMeetingId] = useState('5f3a91e2');
  const [errors, setErrors] = useState<{ 
    title?: string; 
    date?: string; 
    time?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; date?: string; time?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'El título de la reunión es requerido';
    }

    if (!date.trim()) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!time.trim()) {
      newErrors.time = 'La hora es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Crear reunión:', { title, description, date, time, duration, maxParticipants, meetingId });
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Aquí iría la lógica para crear la reunión
    } catch (error) {
      console.error('Error al crear reunión:', error);
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
                type="text"
                label="Duración estimada"
                placeholder="45 minutos"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="create-meeting__form-group">
              <Input
                id="maxParticipants"
                type="text"
                label="Máximo de participantes"
                placeholder="10 participantes"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
              />
            </div>
          </div>

          <div className="create-meeting__form-group">
            <Input
              id="meetingId"
              type="text"
              label="ID de la reunión"
              placeholder="5f3a91e2"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              readOnly
            />
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

