import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../utils/api';
import './Header.scss';

/**
 * Header component containing navigation, logo, and user actions
 * Displays different content based on authentication status
 * @returns {JSX.Element} Header component with navigation and user menu
 */
export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Solo cerrar el menú si el clic no fue en el header o sus elementos
    const target = e.target as HTMLElement;
    if (!target.closest('.header')) {
      closeMobileMenu();
    }
  };

  const handleHeaderClick = (e: React.MouseEvent<HTMLElement>) => {
    // Prevenir que el clic en el header cierre el menú móvil
    e.stopPropagation();
  };

  const handleLogout = async () => {
    try {
      await logout();
      authLogout();
    } catch {
      authLogout();
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div 
        className="header__overlay" 
        onClick={handleOverlayClick}
        aria-hidden={!isMobileMenuOpen}
      />
      <header className="header" role="banner" onClick={handleHeaderClick}>
        <div className="header__container">
        <div className="header__logo-section">
          <Link to="/" className="header__logo" aria-label="Home" onClick={closeMobileMenu}>
            <img src="/logo-menu.png" alt="konned logo" className="header__logo-img" />
          </Link>
          
          <button
            className="header__mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`header__mobile-menu-icon ${isMobileMenuOpen ? 'header__mobile-menu-icon--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        <nav 
          className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`} 
          role="navigation" 
          aria-label="Main navigation"
          id="mobile-menu"
        >
          <ul className="header__nav-list">
            <li>
              <Link
                to="/"
                className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/') ? 'page' : undefined}
                onClick={closeMobileMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className={`header__nav-link ${isActive('/explore') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/explore') ? 'page' : undefined}
                onClick={closeMobileMenu}
              >
                Explorar
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/my-meetings"
                  className={`header__nav-link ${isActive('/my-meetings') ? 'header__nav-link--active' : ''}`}
                  aria-current={isActive('/my-meetings') ? 'page' : undefined}
                  onClick={closeMobileMenu}
                >
                  Mis reuniones
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/about"
                className={`header__nav-link ${isActive('/about') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/about') ? 'page' : undefined}
                onClick={closeMobileMenu}
              >
                Sobre nosotros
              </Link>
            </li>
            <li className="header__nav-mobile-actions">
              <Link
                to="/meetings/create"
                className={`header__nav-link header__nav-link--button ${isActive('/meetings/create') ? 'header__nav-link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                Crear reunión
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <Link
            to="/meetings/create"
            className={`header__button header__button--create ${isActive('/meetings/create') ? 'header__button--active' : ''}`}
            aria-current={isActive('/meetings/create') ? 'page' : undefined}
            onClick={closeMobileMenu}
          >
            Crear reunión
          </Link>
          
          {isAuthenticated ? (
            <div className="header__user">
              <Link to="/account" className="header__user-avatar" title={`${user?.name} ${user?.last_name}`}>
                <span className="header__user-initials">
                  {getUserInitials()}
                </span>
              </Link>
              <div className="header__user-dropdown">
                <Link to="/account" className="header__user-dropdown-item">
                  Mi Perfil
                </Link>
                <Link to="/account/edit" className="header__user-dropdown-item">
                  Editar Perfil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="header__user-dropdown-item header__user-dropdown-item--logout"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="header__button header__button--access">
              Acceder
            </Link>
          )}
        </div>
      </div>
    </header>
    </>
  );
}

