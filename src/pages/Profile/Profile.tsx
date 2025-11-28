import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { deleteAccount } from '../../utils/api';
import { getAuthErrorDetails } from '../../utils/auth';
import Button from '../../components/Button/Button';
import './Profile.scss';

/**
 * Profile page component displaying user information and account management options
 * Includes delete account functionality with confirmation modal
 * @returns {JSX.Element} Profile page with user details and account actions
 */
export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoading, refreshUser, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSecondConfirmation, setShowSecondConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const userId = user?.uid;
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    refreshUser();
  }, [refreshUser, userId]);

  useEffect(() => {
    if (showDeleteModal && cancelButtonRef.current && !showSecondConfirmation) {
      cancelButtonRef.current.focus();
    }
  }, [showDeleteModal, showSecondConfirmation]);

  useEffect(() => {
    if (showSecondConfirmation && confirmationInputRef.current) {
      confirmationInputRef.current.focus();
    }
  }, [showSecondConfirmation]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteModal) {
        handleCloseModal();
      }
    };

    if (showDeleteModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showDeleteModal]);

  const handleDeleteAccount = () => {
    setShowSecondConfirmation(false);
    setConfirmationText('');
    setError('');
    setShowDeleteModal(true);
  };

  /**
   * Closes the delete account modal and resets state
   * @returns {void}
   */
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowSecondConfirmation(false);
    setConfirmationText('');
    setError('');
  };

  /**
   * Shows the second confirmation step in delete account flow
   * @returns {void}
   */
  const handleFirstConfirm = () => {
    setShowSecondConfirmation(true);
  };

  /**
   * Handles final confirmation and deletion of user account
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   */
  const handleConfirmDelete = async () => {
    if (confirmationText.trim().toUpperCase() !== 'ELIMINAR') {
      setError('Debes escribir "ELIMINAR" para confirmar la eliminación');
      return;
    }

    setIsDeleting(true);
    setError('');
    
    try {
      await deleteAccount();
      logout();
      navigate('/', { 
        state: { 
          message: 'Cuenta eliminada exitosamente' 
        } 
      });
    } catch (error) {
      const errorDetails = getAuthErrorDetails(error);
      setError(errorDetails.message);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Gets user initials from name and last name
   * @returns {string} User initials (e.g., "JG" for John Green)
   */
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };



  if (isLoading) {
    return (
      <main className="profile" role="main">
        <div className="profile__container">
          <div className="profile__loading">
            <p>Cargando perfil...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="profile" role="main">
      <div className="profile__container">
        <div className="profile__header">
          <h1 className="profile__title">
            Mi <span className="profile__title-highlight">Perfil</span>
          </h1>
          <p className="profile__subtitle">
            Información de cuenta
          </p>
        </div>

        <div className="profile__card">
          <div className="profile__card-header">
            <div className="profile__avatar">
              <span className="profile__avatar-initials">{getUserInitials()}</span>
            </div>
            <div className="profile__user-info">
              <h2 className="profile__user-name">{user.name} {user.last_name}</h2>
              <p className="profile__username">{user.email}</p>
            </div>
          </div>

          <div className="profile__details">
            <div className="profile__details-row">
              <div className="profile__detail-label">Nombres</div>
              <div className="profile__detail-value">{user.name}</div>
            </div>
            <div className="profile__details-row">
              <div className="profile__detail-label">Apellidos</div>
              <div className="profile__detail-value">{user.last_name}</div>
            </div>
            <div className="profile__details-row">
              <div className="profile__detail-label">Edad</div>
              <div className="profile__detail-value">{user.age}</div>
            </div>
            <div className="profile__details-row">
              <div className="profile__detail-label">Correo</div>
              <div className="profile__detail-value">{user.email}</div>
            </div>
          </div>

          <div className="profile__actions">
            <Button
              variant="primary"
              to="/account/edit"
              className="profile__edit-button"
            >
              Editar Perfil
            </Button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="profile__delete-button"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <>
          <div 
            className="profile__modal-backdrop" 
            onClick={handleCloseModal}
            aria-hidden="true"
          />
          <div 
            className="profile__modal" 
            role="dialog" 
            aria-labelledby="delete-modal-title"
            aria-modal="true"
          >
            <h2 id="delete-modal-title" className="profile__modal-title">
              Eliminar cuenta
            </h2>
            {!showSecondConfirmation ? (
              <>
                <p className="profile__modal-text">
                  ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no puede deshacerse y perderás todos tus datos.
                </p>
                
                {error && (
                  <div className="profile__modal-error" role="alert">
                    {error}
                  </div>
                )}
                
                <div className="profile__modal-actions">
                  <button
                    ref={cancelButtonRef}
                    type="button"
                    onClick={handleCloseModal}
                    className="profile__modal-cancel-button"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleFirstConfirm}
                    className="profile__modal-delete-button"
                  >
                    Continuar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="profile__modal-text">
                  Esta es tu última oportunidad. Para confirmar la eliminación permanente de tu cuenta, escribe <strong>"ELIMINAR"</strong> en el campo de abajo.
                </p>
                
                <div className="profile__modal-confirmation-input">
                  <input
                    ref={confirmationInputRef}
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Escribe ELIMINAR para confirmar"
                    className="profile__modal-input"
                    aria-label="Confirmación de eliminación"
                    disabled={isDeleting}
                  />
                </div>
                
                {error && (
                  <div className="profile__modal-error" role="alert">
                    {error}
                  </div>
                )}
                
                <div className="profile__modal-actions">
                  <button
                    ref={cancelButtonRef}
                    type="button"
                    onClick={handleCloseModal}
                    className="profile__modal-cancel-button"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting || confirmationText.trim().toUpperCase() !== 'ELIMINAR'}
                    className="profile__modal-delete-button"
                  >
                    {isDeleting ? 'Eliminando...' : 'Eliminar definitivamente'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}

