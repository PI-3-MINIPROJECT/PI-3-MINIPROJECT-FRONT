import { Link } from 'react-router-dom';
import './Footer.scss';

/**
 * Footer component
 * Site footer with links and copyright information
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">VideoConference Platform</h3>
            <p className="footer__description">
              A modern platform for video conferencing with real-time communication.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Quick Links</h4>
            <ul className="footer__links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/sitemap">Sitemap</Link>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Resources</h4>
            <ul className="footer__links">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Support
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Contact</h4>
            <ul className="footer__links">
              <li>
                <a href="mailto:support@videoconference.com">support@videoconference.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} VideoConference Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

