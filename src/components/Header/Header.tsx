import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../utils/api';
import './Header.scss';

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated, logout: authLogout } = useAuth();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
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
    <header className="header" role="banner">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="Home">
          <img src="/logo-menu.png" alt="konned logo" className="header__logo-img" />
        </Link>

        <nav className="header__nav" role="navigation" aria-label="Main navigation">
          <ul className="header__nav-list">
            <li>
              <Link
                to="/"
                className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className={`header__nav-link ${isActive('/explore') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/explore') ? 'page' : undefined}
              >
                Explorar
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`header__nav-link ${isActive('/about') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/about') ? 'page' : undefined}
              >
                Sobre nosotros
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <Link
            to="/meetings/create"
            className={`header__button header__button--create ${isActive('/meetings/create') ? 'header__button--active' : ''}`}
            aria-current={isActive('/meetings/create') ? 'page' : undefined}
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
  );
}

