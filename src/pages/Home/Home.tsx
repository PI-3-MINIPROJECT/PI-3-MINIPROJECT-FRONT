import { Link } from 'react-router-dom';
import './Home.scss';

/**
 * Home page component
 * Landing page with main features and call-to-action
 */
export default function Home() {
  return (
    <main className="home" role="main">
      <section className="home__hero">
        <div className="home__container">
          <h1 className="home__title">Welcome to VideoConference Platform</h1>
          <p className="home__subtitle">
            Connect with your team through high-quality video conferencing. 
            Create meetings, chat in real-time, and collaborate seamlessly.
          </p>
          <div className="home__actions">
            <Link to="/register" className="home__button home__button--primary">
              Get Started
            </Link>
            <Link to="/about" className="home__button home__button--secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="home__features">
        <div className="home__container">
          <h2 className="home__section-title">Features</h2>
          <div className="home__features-grid">
            <div className="home__feature-card">
              <div className="home__feature-icon">👥</div>
              <h3>Multi-user Meetings</h3>
              <p>Support for 2 to 10 participants in a single meeting room.</p>
            </div>
            <div className="home__feature-card">
              <div className="home__feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Chat with participants during meetings with instant messaging.</p>
            </div>
            <div className="home__feature-card">
              <div className="home__feature-icon">🎤</div>
              <h3>Voice Transmission</h3>
              <p>Full-duplex audio communication with microphone controls.</p>
            </div>
            <div className="home__feature-card">
              <div className="home__feature-icon">📹</div>
              <h3>Video Streaming</h3>
              <p>High-quality video transmission with camera controls.</p>
            </div>
            <div className="home__feature-card">
              <div className="home__feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>Multi-channel authentication with OAuth providers support.</p>
            </div>
            <div className="home__feature-card">
              <div className="home__feature-icon">♿</div>
              <h3>Accessible Design</h3>
              <p>WCAG compliant interface for all users.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home__cta">
        <div className="home__container">
          <h2 className="home__section-title">Ready to Start?</h2>
          <p className="home__cta-text">
            Create your account and start hosting meetings today.
          </p>
          <Link to="/register" className="home__button home__button--primary">
            Sign Up Now
          </Link>
        </div>
      </section>
    </main>
  );
}

