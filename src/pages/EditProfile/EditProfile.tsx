import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, updatePassword } from '../../utils/api';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './EditProfile.scss';

/**
 * EditProfile page component for updating user information and password
 * Includes form validation, password strength checking, and profile update functionality
 * @returns {JSX.Element} Edit profile page with user information and password update forms
 */
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

  type EditField =
    | 'firstName'
    | 'lastName'
    | 'age'
    | 'email'
    | 'currentPassword'
    | 'newPassword'
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

  const passwordChecks = useMemo(() => getPasswordChecks(newPassword), [newPassword]);


  const isPasswordGroupActive = Boolean(
    currentPassword.trim() || newPassword.trim() || confirmPassword.trim()
  );

  const getFieldValue = (field: EditField): string => {
    switch (field) {
      case 'firstName':
        return firstName;
      case 'lastName':
        return lastName;
      case 'age':
        return age;
      case 'email':
        return email;
      case 'currentPassword':
        return currentPassword;
      case 'newPassword':
        return newPassword;
      case 'confirmPassword':
        return confirmPassword;
      default:
        return '';
    }
  };

  const validateField = (
    field: EditField,
    value: string,
    opts?: { validatePasswordGroup?: boolean; passwordComparisonValue?: string }
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
      case 'age':
        if (!trimmed) return 'La edad es requerida';
        if (isNaN(Number(trimmed))) {
          return 'La edad debe ser numérica';
        }
        if (Number(trimmed) < 1 || Number(trimmed) > 120) {
          return 'La edad debe estar entre 1 y 120';
        }
        return undefined;
      case 'email':
        if (!trimmed) return 'El correo electrónico es requerido';
        if (!emailRegex.test(trimmed)) {
          return 'Ingrese un correo electrónico válido';
        }
        return undefined;
      case 'currentPassword':
        if (!opts?.validatePasswordGroup) return undefined;
        if (!trimmed) return 'La contraseña actual es requerida';
        return undefined;
      case 'newPassword': {
        if (!opts?.validatePasswordGroup) return undefined;
        if (!trimmed) return 'La nueva contraseña es requerida';
        const checks = getPasswordChecks(trimmed);
        if (!Object.values(checks).every(Boolean)) {
          return 'La nueva contraseña debe cumplir con todos los requisitos.';
        }
        return undefined;
      }
      case 'confirmPassword':
        if (!opts?.validatePasswordGroup) return undefined;
        if (!trimmed) return 'Confirma tu nueva contraseña';
        if (trimmed !== (opts?.passwordComparisonValue ?? newPassword)) {
          return 'Las contraseñas no coinciden';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const updateFieldError = (field: EditField, errorMessage?: string) => {
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

  const handleFieldBlur = (field: EditField) => {
    const value = getFieldValue(field);
    const shouldValidatePasswords =
      field === 'currentPassword' ||
      field === 'newPassword' ||
      field === 'confirmPassword'
        ? isPasswordGroupActive
        : true;
    updateFieldError(
      field,
      validateField(field, value, {
        validatePasswordGroup: shouldValidatePasswords,
        passwordComparisonValue: field === 'confirmPassword' ? newPassword : undefined,
      })
    );
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

  const handleAgeChange = (value: string) => {
    const sanitized = sanitizeNumericInput(value);
    setAge(sanitized);
    clearGeneralError();
    if (errors.age) {
      updateFieldError('age', validateField('age', sanitized));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    clearGeneralError();
    if (errors.email) {
      updateFieldError('email', validateField('email', value));
    }
  };

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    clearGeneralError();
    if (errors.currentPassword) {
      updateFieldError(
        'currentPassword',
        validateField('currentPassword', value, {
          validatePasswordGroup: true,
        })
      );
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    clearGeneralError();
    if (errors.newPassword) {
      updateFieldError(
        'newPassword',
        validateField('newPassword', value, { validatePasswordGroup: true })
      );
    }
    if (confirmPassword) {
      updateFieldError(
        'confirmPassword',
        validateField('confirmPassword', confirmPassword, {
          validatePasswordGroup: true,
          passwordComparisonValue: value,
        })
      );
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    clearGeneralError();
    updateFieldError(
      'confirmPassword',
      validateField('confirmPassword', value, {
        validatePasswordGroup: true,
      })
    );
  };

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
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      if (refreshUser) {
        try {
          await refreshUser();
        } catch (error) {
          void error;
        }
      }
    };
    
    loadUserData();
  }, [refreshUser]);

  const fieldsToValidate: EditField[] = [
    'firstName',
    'lastName',
    'age',
    'email',
    'currentPassword',
    'newPassword',
    'confirmPassword',
  ];

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    const isChangingPassword =
      currentPassword.trim() || newPassword.trim() || confirmPassword.trim();

    fieldsToValidate.forEach((field) => {
      const value = getFieldValue(field);
      const errorMessage = validateField(field, value, {
        validatePasswordGroup:
          field === 'currentPassword' ||
          field === 'newPassword' ||
          field === 'confirmPassword'
            ? Boolean(isChangingPassword)
            : undefined,
        passwordComparisonValue: field === 'confirmPassword' ? newPassword : undefined,
      });
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      newErrors.general =
        newErrors.general ??
        'Por favor corrige los campos marcados antes de continuar.';
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

      const isChangingPassword = currentPassword.trim() || newPassword.trim() || confirmPassword.trim();

      await updateProfile(profileUpdates);
      
      if (isChangingPassword) {
        const passwordData = {
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim()
        };
        
        await updatePassword(passwordData);
      }

      try {
        await refreshUser();
      } catch (error) {
        void error;
      }
      
      const successMessage = isChangingPassword 
        ? 'Perfil y contraseña actualizados exitosamente'
        : 'Perfil actualizado exitosamente';
      
      setSuccess(successMessage);
      
      if (isChangingPassword) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
      
      setTimeout(() => {
        navigate('/account', { 
          state: { 
            message: successMessage
          } 
        });
      }, 1500);
    } catch (error) {
      let errorMessage = 'Error al actualizar el perfil';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('Credenciales incorrectas') || 
            errorMessage.includes('No autenticado') || 
            errorMessage.includes('401')) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          
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
          <input type="text" style={{display: 'none'}} />
          <input type="password" style={{display: 'none'}} />
          
          <div className="edit-profile__form-group">
            <Input
              id="firstName"
              type="text"
              label="Nombres"
              placeholder="Ingresa tu nombre"
              value={firstName}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              onBlur={() => handleFieldBlur('firstName')}
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
              onChange={(e) => handleLastNameChange(e.target.value)}
              onBlur={() => handleFieldBlur('lastName')}
              error={errors.lastName}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="age"
              type="text"
              label="Edad"
              placeholder="Ingresa tu edad"
              value={age}
              onChange={(e) => handleAgeChange(e.target.value)}
              onBlur={() => handleFieldBlur('age')}
              error={errors.age}
              disabled={isSubmitting}
              required
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          <div className="edit-profile__form-group">
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => handleFieldBlur('email')}
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
              onChange={(e) => handleCurrentPasswordChange(e.target.value)}
              onBlur={() => handleFieldBlur('currentPassword')}
              error={errors.currentPassword}
              disabled={isSubmitting}
              autoComplete="new-password"
              spellCheck={false}
              autoCorrect="off"
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
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              onBlur={() => handleFieldBlur('newPassword')}
              error={errors.newPassword}
              disabled={isSubmitting}
              autoComplete="new-password"
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
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              onBlur={() => handleFieldBlur('confirmPassword')}
              error={errors.confirmPassword}
              disabled={isSubmitting}
              autoComplete="new-password"
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

          {isPasswordGroupActive && (
            <div className="edit-profile__password-requirements" aria-live="polite">
              <p className="edit-profile__password-requirements-title">La nueva contraseña debe incluir:</p>
              <ul className="edit-profile__password-requirements-list">
                <li className={`edit-profile__password-requirement ${passwordChecks.length ? 'edit-profile__password-requirement--met' : ''}`}>
                  <span className="edit-profile__password-requirement-icon">
                    {passwordChecks.length ? '✔' : '•'}
                  </span>
                  Al menos 6 caracteres
                </li>
                <li className={`edit-profile__password-requirement ${passwordChecks.lowercase ? 'edit-profile__password-requirement--met' : ''}`}>
                  <span className="edit-profile__password-requirement-icon">
                    {passwordChecks.lowercase ? '✔' : '•'}
                  </span>
                  Una letra minúscula
                </li>
                <li className={`edit-profile__password-requirement ${passwordChecks.uppercase ? 'edit-profile__password-requirement--met' : ''}`}>
                  <span className="edit-profile__password-requirement-icon">
                    {passwordChecks.uppercase ? '✔' : '•'}
                  </span>
                  Una letra mayúscula
                </li>
                <li className={`edit-profile__password-requirement ${passwordChecks.number ? 'edit-profile__password-requirement--met' : ''}`}>
                  <span className="edit-profile__password-requirement-icon">
                    {passwordChecks.number ? '✔' : '•'}
                  </span>
                  Un número
                </li>
                <li className={`edit-profile__password-requirement ${passwordChecks.special ? 'edit-profile__password-requirement--met' : ''}`}>
                  <span className="edit-profile__password-requirement-icon">
                    {passwordChecks.special ? '✔' : '•'}
                  </span>
                  Un carácter especial
                </li>
              </ul>
            </div>
          )}

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

