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

      {/* Sección de Colaboración Mejorada */}
      <section className="home__feature">
        <div className="home__container">
          <div className="home__feature-content">
            <div className="home__feature-text">
              <h2 className="home__feature-title">
                Reuniones que potencian tu productividad
              </h2>
              <p className="home__feature-description">
                Transforma tus reuniones en espacios de trabajo colaborativo. Comparte pantalla, 
                edita documentos en tiempo real y mantén a tu equipo sincronizado sin importar 
                dónde se encuentren.
              </p>
            </div>
            <div className="home__feature-image">
              <div className="home__feature-placeholder">
                <span>📊 Colaboración en tiempo real</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Conexión Multiplataforma */}
      <section className="home__feature home__feature--reverse">
        <div className="home__container">
          <div className="home__feature-content">
            <div className="home__feature-text">
              <h2 className="home__feature-title">
                Conecta desde cualquier dispositivo
              </h2>
              <p className="home__feature-description">
                Accede a tus reuniones desde tu computadora, tablet o smartphone. Nuestra plataforma 
                se adapta a cualquier dispositivo para que nunca te pierdas una conexión importante.
              </p>
            </div>
            <div className="home__feature-image">
              <div className="home__feature-placeholder">
                <span>📱 Multiplataforma</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Calidad */}
      <section className="home__feature">
        <div className="home__container">
          <div className="home__feature-content">
            <div className="home__feature-text">
              <h2 className="home__feature-title">
                Audio y video de alta calidad
              </h2>
              <p className="home__feature-description">
                Disfruta de llamadas cristalinas con tecnología de compresión avanzada. 
                Reducción automática de ruido, ajuste de brillo y calidad adaptativa para 
                la mejor experiencia de comunicación.
              </p>
            </div>
            <div className="home__feature-image">
              <div className="home__feature-placeholder">
                <span>🎥 Alta calidad HD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Trabajo en Equipo */}
      <section className="home__feature home__feature--reverse">
        <div className="home__container">
          <div className="home__feature-content">
            <div className="home__feature-text">
              <h2 className="home__feature-title">
                Trabaja mejor en equipo
              </h2>
              <p className="home__feature-description">
                Organiza tus proyectos, gestiona tareas y mantén a todos alineados. 
                Herramientas integradas para compartir archivos, tomar notas y hacer seguimiento 
                de tus objetivos.
              </p>
            </div>
            <div className="home__feature-image">
              <div className="home__feature-placeholder">
                <span>👥 Gestión de equipos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Seguridad */}
      <section className="home__feature">
        <div className="home__container">
          <div className="home__feature-content">
            <div className="home__feature-text">
              <h2 className="home__feature-title">
                Tu privacidad es nuestra prioridad
              </h2>
              <p className="home__feature-description">
                Todas tus reuniones están protegidas con cifrado de extremo a extremo. 
                Controla quién puede unirse, gestiona permisos y mantén tus conversaciones 
                seguras y privadas.
              </p>
            </div>
            <div className="home__feature-image">
              <div className="home__feature-placeholder">
                <span>🔒 Seguridad avanzada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección FAQ */}
      <section className="home__faq">
        <div className="home__container">
          <h2 className="home__faq-title">Preguntas frecuentes</h2>
          <div className="home__faq-list">
            <div className="home__faq-item">
              <h3 className="home__faq-question">¿Cuántas personas pueden unirse a una reunión?</h3>
              <p className="home__faq-answer">
                En el plan gratuito puedes tener hasta 50 participantes. Con planes premium, 
                puedes alojar hasta 500 participantes simultáneos.
              </p>
            </div>
            <div className="home__faq-item">
              <h3 className="home__faq-question">¿Necesito descargar alguna aplicación?</h3>
              <p className="home__faq-answer">
                No es necesario. Puedes usar konned directamente desde tu navegador. 
                También ofrecemos aplicaciones móviles opcionales para iOS y Android.
              </p>
            </div>
            <div className="home__faq-item">
              <h3 className="home__faq-question">¿Mis reuniones son privadas y seguras?</h3>
              <p className="home__faq-answer">
                Sí, todas las reuniones están protegidas con cifrado de extremo a extremo. 
                Solo las personas con el enlace o código de acceso pueden unirse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="home__cta">
        <div className="home__container">
          <div className="home__cta-content">
            <h2 className="home__cta-title">¿Listo para comenzar?</h2>
            <p className="home__cta-subtitle">
              Únete a miles de personas que ya están conectándose con konned
            </p>
            <div className="home__cta-actions">
              <Button variant="primary" to="/meetings/create">
                Iniciar reunión
              </Button>
              <Button variant="secondary" to="/register">
                Crear cuenta gratis
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

