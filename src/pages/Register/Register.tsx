import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { register } from '../../utils/api';
import { handleAuthError, redirectToGoogleOAuth } from '../../utils/auth';
import type { RegisterRequest } from '../../types';
import './Register.scss';

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('28');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    age?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  type RegisterField =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'age'
    | 'password'
    | 'confirmPassword';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const sanitizeNumericInput = (value: string) =>
    value.replace(/[^0-9]/g, '').slice(0, 3);

  const getPasswordChecks = (pwd: string) => ({
    length: pwd.length >= 6,
    lowercase: /[a-z]/.test(pwd),
    uppercase: /[A-Z]/.test(pwd),
    number: /\d/.test(pwd),
    special: /[!@#$%^&*(),.?":{}|<>_-]/.test(pwd),
  });

  const passwordChecks = useMemo(() => getPasswordChecks(password), [password]);

  const getFieldValue = (field: RegisterField): string => {
    switch (field) {
      case 'firstName':
        return firstName;
      case 'lastName':
        return lastName;
      case 'email':
        return email;
      case 'age':
        return age;
      case 'password':
        return password;
      case 'confirmPassword':
        return confirmPassword;
      default:
        return '';
    }
  };

  const validateField = (
    field: RegisterField,
    value: string,
    opts?: { passwordValue?: string }
  ): string | undefined => {
    const trimmed = value.trim();
    switch (field) {
      case 'firstName':
        if (!trimmed) return 'El nombre es requerido';
        if (trimmed.length < 2 || trimmed.length > 50) {
          return 'El nombre debe tener entre 2 y 50 caracteres';
        }
        return undefined;
      case 'lastName':
        if (!trimmed) return 'El apellido es requerido';
        if (trimmed.length < 2 || trimmed.length > 50) {
          return 'El apellido debe tener entre 2 y 50 caracteres';
        }
        return undefined;
      case 'email':
        if (!trimmed) return 'El correo electrónico es requerido';
        if (!emailRegex.test(trimmed)) {
          return 'Ingrese un correo electrónico válido';
        }
        return undefined;
      case 'age':
        if (!trimmed) return 'La edad es requerida';
        if (isNaN(Number(trimmed))) {
          return 'La edad debe ser numérica';
        }
        if (Number(trimmed) < 1 || Number(trimmed) > 120) {
          return 'La edad debe estar entre 1 y 120';
        }
        return undefined;
      case 'password': {
        if (!trimmed) return 'La contraseña es requerida';
        const checks = getPasswordChecks(trimmed);
        if (!Object.values(checks).every(Boolean)) {
          return 'La contraseña debe cumplir con todos los requisitos.';
        }
        return undefined;
      }
      case 'confirmPassword':
        if (!trimmed) return 'Confirme su contraseña';
        if (trimmed !== (opts?.passwordValue ?? password)) {
          return 'Las contraseñas no coinciden';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const updateFieldError = (
    field: RegisterField,
    errorMessage?: string
  ) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (errorMessage) {
        next[field] = errorMessage;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleFieldBlur = (field: RegisterField) => {
    const value = getFieldValue(field);
    updateFieldError(field, validateField(field, value));
  };

  const clearGeneralError = () => {
    setErrors((prev) => {
      if (!prev.general) return prev;
      const next = { ...prev };
      delete next.general;
      return next;
    });
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    clearGeneralError();
    if (errors.firstName) {
      updateFieldError('firstName', validateField('firstName', value));
    }
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    clearGeneralError();
    if (errors.lastName) {
      updateFieldError('lastName', validateField('lastName', value));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    clearGeneralError();
    if (errors.email) {
      updateFieldError('email', validateField('email', value));
    }
  };

  const handleAgeChange = (value: string) => {
    const sanitized = sanitizeNumericInput(value);
    setAge(sanitized);
    clearGeneralError();
    if (errors.age) {
      updateFieldError('age', validateField('age', sanitized));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    clearGeneralError();
    if (errors.password) {
      updateFieldError('password', validateField('password', value));
    }
    if (confirmPassword) {
      updateFieldError(
        'confirmPassword',
        validateField('confirmPassword', confirmPassword, {
          passwordValue: value,
        })
      );
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    clearGeneralError();
    updateFieldError(
      'confirmPassword',
      validateField('confirmPassword', value)
    );
  };

  const fieldsToValidate: RegisterField[] = [
    'firstName',
    'lastName',
    'email',
    'age',
    'password',
    'confirmPassword',
  ];

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    fieldsToValidate.forEach((field) => {
      const value = getFieldValue(field);
      const errorMessage = validateField(field, value);
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    });
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
      const registerData: RegisterRequest = {
        email: email.trim(),
        password,
        name: firstName.trim(),
        last_name: lastName.trim(),
        age: parseInt(age)
      };

      const response = await register(registerData);
      
      if (response.success) {
        navigate('/login', { 
          state: { 
            message: 'Registro exitoso. Ahora puedes iniciar sesión.' 
          } 
        });
      }
    } catch (error) {
      const errorMessage = handleAuthError(error);
      
      if (errorMessage.includes('ya está registrado')) {
        setErrors({ email: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
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
    <div className="app">
      <main className="register" role="main">
        <div className="register__container">
          <div className="register__left">
            <img 
              src="/registro.png" 
              alt="Ilustración de registro" 
              className="register__illustration"
            />
          </div>

          <div className="register__right">
            <div className="register__content">
              <Link to="/" className="register__logo">
                <img src="/logo-menu.png" alt="konned logo" className="register__logo-img" />
              </Link>

              <h1 className="register__title">
                Regístrate
              </h1>

              <p className="register__subtitle">
                Únete a konned y comienza a conectarte
              </p>

              <form className="register__form" onSubmit={handleSubmit} autoComplete="off">
                <input type="text" style={{ display: 'none' }} />
                <input type="password" style={{ display: 'none' }} />
                {errors.general && (
                  <div className="register__error-message" role="alert">
                    {errors.general}
                  </div>
                )}
                
                <div className="register__form-row">
                  <Input
                    id="firstName"
                    name="register-first-name"
                    type="text"
                    label="Nombres"
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    onBlur={() => handleFieldBlur('firstName')}
                    error={errors.firstName}
                    required
                    autoComplete="off"
                  />
                  <Input
                    id="lastName"
                    name="register-last-name"
                    type="text"
                    label="Apellidos"
                    placeholder="e.g. Green"
                    value={lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    onBlur={() => handleFieldBlur('lastName')}
                    error={errors.lastName}
                    required
                    autoComplete="off"
                  />
                </div>

                <Input
                  id="email"
                  name="register-email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  error={errors.email}
                  required
                  autoComplete="off"
                />

                <Input
                  id="age"
                  name="register-age"
                  type="text"
                  label="Edad"
                  placeholder="28"
                  value={age}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  onBlur={() => handleFieldBlur('age')}
                  error={errors.age}
                  required
                  autoComplete="off"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />

                <div className="register__password-wrapper">
                  <Input
                    id="password"
                    name="register-password"
                    type={showPassword ? 'text' : 'password'}
                    label="Contraseña"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                    error={errors.password}
                    required
                    autoComplete="new-password"
                    spellCheck={false}
                    autoCorrect="off"
                    icon={
                      <button
                        type="button"
                        className="register__password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        <PasswordToggleIcon show={showPassword} />
                      </button>
                    }
                  />
                </div>
                <div className="register__password-requirements" aria-live="polite">
                  <p className="register__password-requirements-title">La contraseña debe incluir:</p>
                  <ul className="register__password-requirements-list">
                    <li className={`register__password-requirement ${passwordChecks.length ? 'register__password-requirement--met' : ''}`}>
                      <span className="register__password-requirement-icon">
                        {passwordChecks.length ? '✔' : '•'}
                      </span>
                      Al menos 6 caracteres
                    </li>
                    <li className={`register__password-requirement ${passwordChecks.lowercase ? 'register__password-requirement--met' : ''}`}>
                      <span className="register__password-requirement-icon">
                        {passwordChecks.lowercase ? '✔' : '•'}
                      </span>
                      Una letra minúscula
                    </li>
                    <li className={`register__password-requirement ${passwordChecks.uppercase ? 'register__password-requirement--met' : ''}`}>
                      <span className="register__password-requirement-icon">
                        {passwordChecks.uppercase ? '✔' : '•'}
                      </span>
                      Una letra mayúscula
                    </li>
                    <li className={`register__password-requirement ${passwordChecks.number ? 'register__password-requirement--met' : ''}`}>
                      <span className="register__password-requirement-icon">
                        {passwordChecks.number ? '✔' : '•'}
                      </span>
                      Un número
                    </li>
                    <li className={`register__password-requirement ${passwordChecks.special ? 'register__password-requirement--met' : ''}`}>
                      <span className="register__password-requirement-icon">
                        {passwordChecks.special ? '✔' : '•'}
                      </span>
                      Un carácter especial
                    </li>
                  </ul>
                </div>

                <div className="register__password-wrapper">
                  <Input
                    id="confirmPassword"
                    name="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirmar contraseña"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    required
                    autoComplete="new-password"
                    spellCheck={false}
                    autoCorrect="off"
                    icon={
                      <button
                        type="button"
                        className="register__password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        <PasswordToggleIcon show={showConfirmPassword} />
                      </button>
                    }
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="register__submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registrando...' : 'Regístrate'}
                </Button>
              </form>

              <p className="register__login-text">
                ¿Ya tienes una cuenta? <Link to="/login" className="register__login-link">Inicia sesión</Link>
              </p>

              <div className="register__divider">
                <span className="register__divider-text">O regístrate con</span>
              </div>

              <div className="register__social">
                <button type="button" className="register__social-button register__social-button--facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#1877F2"/>
                    <text x="12" y="17" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">f</text>
                  </svg>
                </button>
                <button 
                  type="button" 
                  className="register__social-button register__social-button--google"
                  onClick={redirectToGoogleOAuth}
                  title="Registrarse con Google"
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
        </div>
      </main>
    </div>
  );
}

