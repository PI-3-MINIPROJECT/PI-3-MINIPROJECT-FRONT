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
          <h1>VideoConference Platform</h1>
        </Link>

        <nav className="header__nav" role="navigation" aria-label="Main navigation">
          <ul className="header__nav-list">
            <li>
              <Link
                to="/"
                className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`header__nav-link ${isActive('/about') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/about') ? 'page' : undefined}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/sitemap"
                className={`header__nav-link ${isActive('/sitemap') ? 'header__nav-link--active' : ''}`}
                aria-current={isActive('/sitemap') ? 'page' : undefined}
              >
                Sitemap
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <Link to="/login" className="header__button header__button--secondary">
            Login
          </Link>
          <Link to="/register" className="header__button header__button--primary">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

