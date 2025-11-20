import './About.scss';

export default function About() {
  return (
    <main className="about" role="main">
      <div className="about__container">
        <section className="about__hero">
          <h1 className="about__title">
            Sobre <span className="about__title-highlight">Nosotros</span>
          </h1>
          <p className="about__intro">
            Una plataforma diseñada para conectar, compartir y crear juntos. Colabora y conéctate desde cualquier lugar, en cualquier momento.
          </p>
        </section>

        <section className="about__mission">
          <div className="about__mission-content">
            <div className="about__mission-text">
              <h2 className="about__mission-title">Nuestra Misión</h2>
              <p className="about__mission-description">
                En konned, creemos que la comunicación efectiva es la base de cualquier colaboración exitosa. Nuestra misión es eliminar las barreras geográficas y permitir que equipos y personas se conecten de manera natural y productiva.
              </p>
            </div>
            <div className="about__mission-illustration">
              <img 
                src="/nosotros.png" 
                alt="Sobre Nosotros" 
                className="about__mission-image"
              />
            </div>
          </div>
        </section>

        <section className="about__features">
          <h2 className="about__features-title">Características Principales</h2>
          <div className="about__features-grid">
            <div className="about__feature-card">
              <div className="about__feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="about__feature-title">Conecta personas</h3>
              <p className="about__feature-description">
                Facilita la comunicación de equipos y personas desde cualquier lugar del mundo.
              </p>
            </div>

            <div className="about__feature-card">
              <div className="about__feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="about__feature-title">Tiempo real</h3>
              <p className="about__feature-description">
                Tecnología de última generación para una experiencia fluida y sin interrupciones.
              </p>
            </div>

            <div className="about__feature-card">
              <div className="about__feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="white" strokeWidth="2"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="about__feature-title">Seguro y Privado</h3>
              <p className="about__feature-description">
                Tus reuniones están protegidas y seguras.
              </p>
            </div>

            <div className="about__feature-card">
              <div className="about__feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M2 12H22" stroke="white" strokeWidth="2"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                  <path d="M12 9C12.5523 9 13 9.44772 13 10C13 10.5523 12.5523 11 12 11C11.4477 11 11 10.5523 11 10C11 9.44772 11.4477 9 12 9Z" fill="white"/>
                  <path d="M12 13V15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="about__feature-title">Accesible</h3>
              <p className="about__feature-description">
                Diseñado para ser accesible y fácil de usar para todos los usuarios.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
