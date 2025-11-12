import { Link } from 'react-router-dom';
import './Sitemap.scss';

/**
 * Sitemap page component
 * Site structure and navigation map
 */
export default function Sitemap() {
  return (
    <main className="sitemap" role="main">
      <div className="sitemap__container">
        <h1>Site Map</h1>
        <p className="sitemap__intro">
          Navigate through all available pages and sections of the platform.
        </p>

        <section className="sitemap__section">
          <h2>Public Pages</h2>
          <ul className="sitemap__list">
            <li>
              <Link to="/">Home</Link>
              <span className="sitemap__description">Main landing page with features and call-to-action</span>
            </li>
            <li>
              <Link to="/about">About Us</Link>
              <span className="sitemap__description">Information about the platform and project</span>
            </li>
            <li>
              <Link to="/sitemap">Sitemap</Link>
              <span className="sitemap__description">This page - site structure overview</span>
            </li>
          </ul>
        </section>

        <section className="sitemap__section">
          <h2>Authentication</h2>
          <ul className="sitemap__list">
            <li>
              <Link to="/login">Login</Link>
              <span className="sitemap__description">User authentication page</span>
            </li>
            <li>
              <Link to="/register">Register</Link>
              <span className="sitemap__description">New user registration</span>
            </li>
            <li>
              <Link to="/forgot-password">Forgot Password</Link>
              <span className="sitemap__description">Password recovery</span>
            </li>
          </ul>
        </section>

        <section className="sitemap__section">
          <h2>User Dashboard</h2>
          <ul className="sitemap__list">
            <li>
              <Link to="/dashboard">Dashboard</Link>
              <span className="sitemap__description">User profile and settings</span>
            </li>
            <li>
              <Link to="/meetings">My Meetings</Link>
              <span className="sitemap__description">List of user's meetings</span>
            </li>
            <li>
              <Link to="/meetings/create">Create Meeting</Link>
              <span className="sitemap__description">Create a new meeting room</span>
            </li>
            <li>
              <Link to="/meetings/:id">Meeting Room</Link>
              <span className="sitemap__description">Active meeting with video/audio/chat</span>
            </li>
          </ul>
        </section>

        <section className="sitemap__section">
          <h2>Site Structure</h2>
          <div className="sitemap__tree">
            <ul>
              <li>
                <strong>/</strong> (Home)
                <ul>
                  <li>
                    <strong>/about</strong> (About Us)
                  </li>
                  <li>
                    <strong>/sitemap</strong> (Sitemap)
                  </li>
                  <li>
                    <strong>/login</strong> (Login)
                  </li>
                  <li>
                    <strong>/register</strong> (Register)
                  </li>
                  <li>
                    <strong>/forgot-password</strong> (Password Recovery)
                  </li>
                  <li>
                    <strong>/dashboard</strong> (User Dashboard)
                    <ul>
                      <li>
                        <strong>/meetings</strong> (My Meetings)
                      </li>
                      <li>
                        <strong>/meetings/create</strong> (Create Meeting)
                      </li>
                      <li>
                        <strong>/meetings/:id</strong> (Meeting Room)
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

