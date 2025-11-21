import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../utils/api';
import { handleAuthError } from '../../utils/auth';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './ForgotPassword.scss';

/**
 * ForgotPassword page component for requesting password reset via email
 * Sends password reset email to the user's email address
 * @returns {JSX.Element} Forgot password page with email input form
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
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
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      const errorMessage = handleAuthError(error);
      setErrors({ email: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  return (
    <div className="app">
      <main className="forgot-password" role="main">
        <div className="forgot-password__container">
          <div className="forgot-password__left">
            <div className="forgot-password__content">
              <Link to="/" className="forgot-password__logo">
                <img src="/logo-menu.png" alt="konned logo" className="forgot-password__logo-img" />
              </Link>

              <Link to="/login" className="forgot-password__back-link">
                ← Volver a iniciar sesión
              </Link>

              <h1 className="forgot-password__title">
                Recuperar <span className="forgot-password__title-highlight">contraseña</span>
              </h1>

              {!isSubmitted ? (
                <>
                  <p className="forgot-password__subtitle">
                    No te preocupes, nos pasa a todos. Ingresa tu correo electrónico a continuación para recuperar tu contraseña.
                  </p>

                  <form className="forgot-password__form" onSubmit={handleSubmit}>
                    <Input
                      id="email"
                      type="email"
                      label="Correo electrónico"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={handleEmailChange}
                      error={errors.email}
                      required
                    />

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="forgot-password__submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
                    </Button>
                  </form>

                  <div className="forgot-password__divider">
                    <span className="forgot-password__divider-text">O continúa con</span>
                  </div>

                  <div className="forgot-password__social">
                    <button type="button" className="forgot-password__social-button forgot-password__social-button--facebook">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#1877F2"/>
                        <text x="12" y="17" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">f</text>
                      </svg>
                    </button>
                    <button type="button" className="forgot-password__social-button forgot-password__social-button--google">
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="forgot-password__success">
                  <p className="forgot-password__success-text">
                    Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
                    Por favor, revisa tu correo electrónico y sigue las instrucciones.
                  </p>
                  <Link to="/login" className="forgot-password__back-button">
                    Volver a iniciar sesión
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="forgot-password__right">
            <img 
              src="/recuperar.png" 
              alt="Ilustración de recuperación de contraseña" 
              className="forgot-password__illustration"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

