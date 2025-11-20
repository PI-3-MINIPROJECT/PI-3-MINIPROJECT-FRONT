import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './EditProfile.scss';

export default function EditProfile() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Green');
  const [age, setAge] = useState('28');
  const [email, setEmail] = useState('example@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ 
    firstName?: string;
    lastName?: string;
    age?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!age.trim()) {
      newErrors.age = 'La edad es requerida';
    } else if (isNaN(Number(age)) || Number(age) < 0) {
      newErrors.age = 'La edad debe ser un número válido';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (newPassword && newPassword.length < 6) {
      newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
    }

    if (newPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      console.log('Actualizar perfil:', { firstName, lastName, age, email, currentPassword, newPassword });
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/account');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordToggleIcon = ({ show }: { show: boolean }) => (
    show ? (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17C15 17 18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" fill="currentColor"/>
        <path d="M2.5 2.5L17.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17C15 17 18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" fill="currentColor"/>
      </svg>
    )
  );

  return (
    <main className="edit-profile" role="main">
      <div className="edit-profile__container">
        <div className="edit-profile__header">
          <h1 className="edit-profile__title">
            Editar <span className="edit-profile__title-highlight">perfil</span>
          </h1>
          <p className="edit-profile__subtitle">
            Actualiza tu información personal
          </p>
        </div>

        <form className="edit-profile__form" onSubmit={handleSubmit}>
          <div className="edit-profile__form-group">
            <Input
              id="firstName"
              type="text"
              label="Nombres"
              placeholder="e.g. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="lastName"
              type="text"
              label="Apellidos"
              placeholder="e.g. Green"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="age"
              type="text"
              label="Edad"
              placeholder="28"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              error={errors.age}
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              label="Contraseña actual"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              error={errors.currentPassword}
              icon={
                <button
                  type="button"
                  className="edit-profile__password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <PasswordToggleIcon show={showCurrentPassword} />
                </button>
              }
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              label="Nueva contraseña"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              icon={
                <button
                  type="button"
                  className="edit-profile__password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <PasswordToggleIcon show={showNewPassword} />
                </button>
              }
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar nueva contraseña"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={
                <button
                  type="button"
                  className="edit-profile__password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <PasswordToggleIcon show={showConfirmPassword} />
                </button>
              }
            />
          </div>

          <div className="edit-profile__actions">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="edit-profile__save-button"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Link to="/account" className="edit-profile__cancel-button">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

