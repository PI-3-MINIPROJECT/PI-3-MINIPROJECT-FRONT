import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from '../../utils/api';
import { handleAuthError } from '../../utils/auth';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './ResetPassword.scss';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Verificar parámetros de la URL
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    
    if (mode !== 'resetPassword' || !oobCode) {
      // Redirigir a error o login si no hay parámetros válidos
      navigate('/login?error=invalid_reset_link');
    }
  }, [navigate, searchParams]);

  const validateForm = (): boolean => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (newPassword !== confirmPassword) {
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
    setErrors({});
    
    try {
      const oobCode = searchParams.get('oobCode');
      
      if (!oobCode) {
        throw new Error('Código de verificación no válido');
      }

      await confirmPasswordReset(oobCode, newPassword);
      setIsSuccess(true);
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/login?success=password_reset');
      }, 3000);
      
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      const errorMessage = handleAuthError(error);
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (errors.newPassword) {
      setErrors({ ...errors, newPassword: undefined });
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: undefined });
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
    <div className="app">
      <main className="reset-password" role="main">
        <div className="reset-password__container">
          <div className="reset-password__left">
            <div className="reset-password__content">
              <Link to="/" className="reset-password__logo">
                <img src="/logo-menu.png" alt="konned logo" className="reset-password__logo-img" />
              </Link>

              <Link to="/login" className="reset-password__back-link">
                ← Volver a iniciar sesión
              </Link>

              <h1 className="reset-password__title">
                Restablecer <span className="reset-password__title-highlight">contraseña</span>
              </h1>

              {!isSuccess ? (
                <>
                  <p className="reset-password__subtitle">
                    Ingresa tu nueva contraseña para completar el proceso de recuperación.
                  </p>

                  {errors.general && (
                    <div className="reset-password__error" role="alert">
                      {errors.general}
                    </div>
                  )}

                  <form className="reset-password__form" onSubmit={handleSubmit}>
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      label="Nueva contraseña"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      error={errors.newPassword}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      icon={
                        <button
                          type="button"
                          className="reset-password__toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          <PasswordToggleIcon show={showPassword} />
                        </button>
                      }
                    />

                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirmar nueva contraseña"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      error={errors.confirmPassword}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      icon={
                        <button
                          type="button"
                          className="reset-password__toggle-password"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          <PasswordToggleIcon show={showConfirmPassword} />
                        </button>
                      }
                    />

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="reset-password__submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Procesando...' : 'Restablecer contraseña'}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="reset-password__success">
                  <div className="reset-password__success-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="24" fill="#10B981"/>
                      <path d="M16 24l6 6 12-12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="reset-password__success-title">¡Contraseña restablecida!</h2>
                  <p className="reset-password__success-text">
                    Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión en unos segundos.
                  </p>
                  <Link to="/login" className="reset-password__back-button">
                    Ir a iniciar sesión
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="reset-password__right">
            <img 
              src="/recuperar.png" 
              alt="Ilustración de restablecimiento de contraseña" 
              className="reset-password__illustration"
            />
          </div>
        </div>
      </main>
    </div>
  );
}