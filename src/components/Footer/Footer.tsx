import { Link } from 'react-router-dom';
import './Footer.scss';

/**
 * Footer component containing site links, logo, and copyright information
 * @returns {JSX.Element} Footer component with navigation links and copyright
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__logo-section">
            <div className="footer__logo">
              <img src="/logo-menu.png" alt="konned logo" className="footer__logo-img" />
            </div>
            <p className="footer__tagline">
              Conectando personas en tiempo real
            </p>
          </div>

          <nav className="footer__nav">
            <ul className="footer__links">
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/about">Sobre Nosotros</Link>
              </li>
              <li>
                <Link to="/sitemap">Mapa del Sitio</Link>
              </li>
              <li>
                <Link to="/login">Iniciar sesión</Link>
              </li>
              <li>
                <Link to="/register">Registro</Link>
              </li>
              <li>
                <Link to="/forgot-password">Recuperar contraseña</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/meetings">Mis Reuniones</Link>
              </li>
              <li>
                <Link to="/meetings/create">Crear Reunión</Link>
              </li>
              <li>
                <a
                  href="/Manual%20de%20usuario%20konned.pdf"
                  download="Manual de usuario konned.pdf"
                  aria-label="Descargar manual de usuario"
                >
                  Manual de Usuario
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} konned todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}

