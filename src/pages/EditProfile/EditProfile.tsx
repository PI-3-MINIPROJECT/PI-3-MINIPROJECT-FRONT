import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, updatePassword } from '../../utils/api';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './EditProfile.scss';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, isLoading, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ 
    firstName?: string;
    lastName?: string;
    age?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      setFirstName(user.name || '');
      setLastName(user.last_name || '');
      setAge(user.age?.toString() || '');
      setEmail(user.email || '');
    }
  }, [user, isLoading, navigate]);

  // Forzar recarga de datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      if (refreshUser) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Error al refrescar datos del usuario:', error);
        }
      }
    };
    
    loadUserData();
  }, [refreshUser]); // Ejecutar cuando refreshUser esté disponible

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (firstName.length < 2 || firstName.length > 50) {
      newErrors.firstName = 'El nombre debe tener entre 2 y 50 caracteres';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (lastName.length < 2 || lastName.length > 50) {
      newErrors.lastName = 'El apellido debe tener entre 2 y 50 caracteres';
    }

    if (!age.trim()) {
      newErrors.age = 'La edad es requerida';
    } else {
      const ageNum = Number(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = 'La edad debe ser un número entre 1 y 120';
      }
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    // Validaciones de contraseña (solo si se está intentando cambiar)
    const isChangingPassword = currentPassword.trim() || newPassword.trim() || confirmPassword.trim();
    
    if (isChangingPassword) {
      if (!currentPassword.trim()) {
        newErrors.currentPassword = 'La contraseña actual es requerida';
      }
      
      if (!newPassword.trim()) {
        newErrors.newPassword = 'La nueva contraseña es requerida';
      } else if (newPassword.length < 6) {
        newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres';
      }
      
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Confirma tu nueva contraseña';
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
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
    setErrors({});
    setSuccess('');

    try {
      // Actualizar datos del perfil
      const ageNumber = parseInt(age.trim(), 10);
      if (isNaN(ageNumber)) {
        throw new Error('La edad debe ser un número válido');
      }
      
      const profileUpdates = {
        name: firstName.trim(),
        last_name: lastName.trim(),
        age: ageNumber,
        email: email.trim()
      };

      // Detectar si se está cambiando contraseña
      const isChangingPassword = currentPassword.trim() || newPassword.trim() || confirmPassword.trim();

      await updateProfile(profileUpdates);
      
      // Si se está cambiando la contraseña, hacer la actualización por separado
      if (isChangingPassword) {
        const passwordData = {
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim()
        };
        
        await updatePassword(passwordData);
      }

      // Refrescar los datos del usuario (el backend debería mantener la sesión activa)
      try {
        await refreshUser();
      } catch (error) {
        console.warn('Error al refrescar usuario después de actualización:', error);
        // Si hay error, solo loguearlo pero no fallar el proceso
      }
      
      const successMessage = isChangingPassword 
        ? 'Perfil y contraseña actualizados exitosamente'
        : 'Perfil actualizado exitosamente';
      
      setSuccess(successMessage);
      
      // Limpiar campos de contraseña después de actualización exitosa
      if (isChangingPassword) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
      
      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        navigate('/account', { 
          state: { 
            message: successMessage
          } 
        });
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar:', error);
      
      let errorMessage = 'Error al actualizar el perfil';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Si es un error de autenticación, dar una sugerencia más útil
        if (errorMessage.includes('Credenciales incorrectas') || 
            errorMessage.includes('No autenticado') || 
            errorMessage.includes('401')) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          
          // Opcional: redirigir automáticamente al login después de unos segundos
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }
      
      setErrors({ general: errorMessage });
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

  // Mostrar loading mientras se cargan los datos
  if (isLoading || !user) {
    return (
      <main className="edit-profile" role="main">
        <div className="edit-profile__container">
          <div className="edit-profile__loading">
            <p>Cargando datos del perfil...</p>
          </div>
        </div>
      </main>
    );
  }

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

        {success && (
          <div className="edit-profile__success" role="alert">
            {success}
          </div>
        )}

        {errors.general && (
          <div className="edit-profile__error" role="alert">
            {errors.general}
          </div>
        )}

        <form className="edit-profile__form" onSubmit={handleSubmit}>
          {/* Campos ocultos para engañar al autocompletado del navegador */}
          <input type="text" style={{display: 'none'}} />
          <input type="password" style={{display: 'none'}} />
          
          <div className="edit-profile__form-group">
            <Input
              id="firstName"
              type="text"
              label="Nombres"
              placeholder="Ingresa tu nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="lastName"
              type="text"
              label="Apellidos"
              placeholder="Ingresa tus apellidos"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="age"
              type="number"
              label="Edad"
              placeholder="Ingresa tu edad"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              error={errors.age}
              disabled={isSubmitting}
              min="1"
              max="120"
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="current-pwd-edit"
              name="current-pwd-edit"
              type={showCurrentPassword ? 'text' : 'password'}
              label="Contraseña actual"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              error={errors.currentPassword}
              disabled={isSubmitting}
              autoComplete="nope"
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
              id="new-pwd-edit"
              name="new-pwd-edit"
              type={showNewPassword ? 'text' : 'password'}
              label="Nueva contraseña"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              disabled={isSubmitting}
              autoComplete="nope"
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
              id="confirm-pwd-edit"
              name="confirm-pwd-edit"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar nueva contraseña"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              disabled={isSubmitting}
              autoComplete="nope"
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
              disabled={isSubmitting || isLoading}
              className="edit-profile__save-button"
            >
              {isSubmitting ? '⟳ Guardando...' : 'Guardar cambios'}
            </Button>
            <Link 
              to="/account" 
              className={`edit-profile__cancel-button ${isSubmitting ? 'edit-profile__cancel-button--disabled' : ''}`}
              onClick={(e) => {
                if (isSubmitting) {
                  e.preventDefault();
                }
              }}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

