import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

/**
 * Header component
 * Main navigation header with menu items
 */
export default function Header() {
  const location = useLocation();

  /**
   * Check if a route is active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
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
          <Link to="/login" className="header__button header__button--access">
            Acceder
          </Link>
        </div>
      </div>
    </header>
  );
}

