import Button from '../../components/Button/Button';
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
          <div className="home__hero-content">
            <div className="home__hero-left">
              <div className="home__logo">
                <img 
                  src="/logo2.png" 
                  alt="konned logo" 
                  className="home__logo-img"
                />
              </div>
              <h1 className="home__title">
                Conecta, comparte y <span className="home__title-highlight">crea</span> juntos
              </h1>
              <p className="home__subtitle">
                Colabora y conectate desde cualquier lugar, en cualquier momento.
              </p>
              <div className="home__actions">
                <Button variant="primary" to="/meetings/create">
                  Crea una Reunión
                </Button>
                <Button variant="secondary" to="/register">
                  Únete Gratis
                </Button>
              </div>
            </div>
            <div className="home__hero-right">
              <div className="home__illustration">
                <img 
                  src="/monitor.png" 
                  alt="Monitor con videoconferencia" 
                  className="home__illustration-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home__message">
        <div className="home__container">
          <h2 className="home__message-title">
            Conecta, comparte y <span className="home__title-highlight">crea</span> juntos
          </h2>
        </div>
      </section>
    </main>
  );
}

