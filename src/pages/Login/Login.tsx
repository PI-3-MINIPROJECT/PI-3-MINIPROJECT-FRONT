import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { login } from '../../utils/api';
import { handleAuthError, redirectToGoogleOAuth, getCurrentUser } from '../../utils/auth';
import type { LoginRequest } from '../../types';
import './Login.scss';

/**
 * Login page component for user authentication
 * Handles manual login, OAuth redirects, and displays success messages from registration
 * @returns {JSX.Element} Login page with email/password form and OAuth options
 */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Detectar cuando vuelve de OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('oauth_success') === 'true') {
      console.log('✅ Login exitoso con Google - Parámetro detectado');
      
      // Intentar obtener el perfil del usuario
      // La cookie httpOnly se envía automáticamente, no necesitamos verificarla manualmente
      const fetchUserProfile = async () => {
        try {
          console.log('🔄 Obteniendo perfil de usuario...');
          const response = await getCurrentUser();
          
          if (response.success && response.data) {
            console.log('✅ Perfil de usuario obtenido:', response.data);
            setUser(response.data, true);
            
            // Redirigir a dashboard/explore
            navigate('/explore', { 
              state: { 
                message: '¡Bienvenido! Has iniciado sesión con Google exitosamente.' 
              } 
            });
          } else {
            throw new Error('No se pudo obtener el perfil del usuario');
          }
        } catch (error) {
          console.error('❌ Error al obtener perfil de usuario:', error);
          setErrors({ general: 'Error al obtener tu información. Por favor, intenta iniciar sesión nuevamente.' });
        }
      };
      
      // Pequeño delay para asegurar que la cookie se haya establecido
      setTimeout(() => {
        fetchUserProfile();
      }, 100);
    }
  }, [navigate, setUser]);

  useEffect(() => {
    // Manejar mensajes del estado de navegación
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }

    // Manejar mensajes de parámetros URL
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'password_reset') {
      setSuccessMessage('Contraseña restablecida exitosamente. Ya puedes iniciar sesión.');
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }

    if (error === 'invalid_reset_link') {
      setErrors({ general: 'El enlace de recuperación no es válido o ha expirado.' });
    }
  }, [location.state, searchParams]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
    setSuccessMessage('');
    
    try {
      const loginData: LoginRequest = {
        email: email.trim(),
        password
      };

      const response = await login(loginData);
      
      if (response.success) {
        setUser(response.data, rememberMe);
        navigate('/explore', { 
          state: { 
            user: response.data,
            message: 'Bienvenido de vuelta!'
          } 
        });
      }
    } catch (error) {
      const errorMessage = handleAuthError(error);
      
      if (
        errorMessage.includes('Credenciales incorrectas') ||
        errorMessage.includes('401') ||
        errorMessage.includes('No autenticado') ||
        errorMessage.includes('Sesión expirada')
      ) {
        setErrors({ general: 'Correo electrónico o contraseña incorrectos' });
      } else {
        setErrors({ general: errorMessage });
      }
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  return (
    <div className="app">
      <main className="login" role="main">
        <div className="login__container">
        <div className="login__left">
          <div className="login__content">
            <Link to="/" className="login__logo">
              <img src="/logo-menu.png" alt="konned logo" className="login__logo-img" />
            </Link>

            <h1 className="login__title">
              Iniciar <span className="login__title-highlight">Sesión</span>
            </h1>

            <p className="login__subtitle">
              Inicie sesión para acceder a su cuenta konned.
            </p>

            <form className="login__form" onSubmit={handleSubmit}>
              {successMessage && (
                <div className="login__success-message" role="alert">
                  {successMessage}
                </div>
              )}
              
              {errors.general && (
                <div className="login__error-message" role="alert">
                  {errors.general}
                </div>
              )}
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

              <div className="login__password-wrapper">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  required
                  icon={
                    <button
                      type="button"
                      className="login__password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17C15 17 18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" fill="currentColor"/>
                          <path d="M2.5 2.5L17.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3C5 3 1.73 7.11 1 10C1.73 12.89 5 17 10 17C15 17 18.27 12.89 19 10C18.27 7.11 15 3 10 3ZM10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C12.76 5 15 7.24 15 10C15 12.76 12.76 15 10 15ZM10 7C8.34 7 7 8.34 7 10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10C13 8.34 11.66 7 10 7Z" fill="currentColor"/>
                        </svg>
                      )}
                    </button>
                  }
                />
              </div>

              <div className="login__options">
                <label className="login__checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login__checkbox"
                  />
                  <span>Recuérdame</span>
                </label>

                <Link to="/forgot-password" className="login__forgot-link">
                  ¿Olvidó su contraseña?
                </Link>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="login__submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <p className="login__register-text">
              ¿No tiene una cuenta? <Link to="/register" className="login__register-link">Crea una</Link>
            </p>

            <div className="login__divider">
              <span className="login__divider-text">O continúa con</span>
            </div>

            <div className="login__social">
              <button type="button" className="login__social-button login__social-button--facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#1877F2"/>
                  <text
                    x="12"
                    y="17"
                    fontFamily="Arial, sans-serif"
                    fontSize="16"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                  >
                    f
                  </text>
                </svg>
              </button>
              <button 
                type="button" 
                className="login__social-button login__social-button--google"
                onClick={redirectToGoogleOAuth}
                title="Iniciar sesión con Google"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="login__right">
          <img 
            src="/login.png" 
            alt="Ilustración de videoconferencia" 
            className="login__illustration"
          />
        </div>
        </div>
      </main>
    </div>
  );
}

