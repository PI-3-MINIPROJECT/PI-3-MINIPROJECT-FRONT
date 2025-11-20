import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import './Profile.scss';

export default function Profile() {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setPassword('');
    setShowPassword(false);
  };

  const handleConfirmDelete = async () => {
    if (!password.trim()) {
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Eliminar cuenta con contraseña:', password);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Aquí iría la lógica para eliminar la cuenta
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
    } finally {
      setIsDeleting(false);
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
              <span className="profile__avatar-initials">JG</span>
            </div>
            <div className="profile__user-info">
              <h2 className="profile__user-name">John Green</h2>
              <p className="profile__username">Jhon Green</p>
            </div>
          </div>

          <div className="profile__details">
            <div className="profile__details-row">
              <div className="profile__detail-label">Nombres</div>
              <div className="profile__detail-value">John</div>
            </div>
            <div className="profile__details-row">
              <div className="profile__detail-label">Apellidos</div>
              <div className="profile__detail-value">Green</div>
            </div>
            <div className="profile__details-row">
              <div className="profile__detail-label">Edad</div>
              <div className="profile__detail-value">28</div>
            </div>
            <div className="profile__details-row">
              <div className="profile__detail-label">Correo</div>
              <div className="profile__detail-value">example@gmail.com</div>
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
          <div className="profile__modal" role="dialog" aria-labelledby="delete-modal-title">
            <h2 id="delete-modal-title" className="profile__modal-title">
              Eliminar cuenta
            </h2>
            <p className="profile__modal-text">
              Ingresa tu contraseña para confirmar la eliminación. Esta acción no puede deshacerse.
            </p>
            <div className="profile__modal-form">
              <Input
                id="delete-password"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={
                  <button
                    type="button"
                    className="profile__modal-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <PasswordToggleIcon show={showPassword} />
                  </button>
                }
              />
            </div>
            <div className="profile__modal-actions">
              <button
                type="button"
                onClick={handleCloseModal}
                className="profile__modal-cancel-button"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={!password.trim() || isDeleting}
                className="profile__modal-delete-button"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar definitivamente'}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

