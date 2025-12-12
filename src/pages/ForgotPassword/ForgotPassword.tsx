import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../utils/api';
import { getAuthErrorDetails } from '../../utils/auth';
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
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; general?: string } = {};

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
      const errorDetails = getAuthErrorDetails(error);
      if (errorDetails.field === 'email') {
        setErrors({ email: errorDetails.message });
      } else {
        setErrors({ general: errorDetails.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.slice(0, 255);
    setEmail(sanitized);
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
                      maxLength={255}
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

