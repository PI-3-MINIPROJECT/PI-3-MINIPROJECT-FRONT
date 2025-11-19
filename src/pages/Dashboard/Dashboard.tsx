import { Link } from 'react-router-dom';
import './Dashboard.scss';

export default function Dashboard() {
  return (
    <main className="dashboard" role="main">
      <div className="dashboard__container">
        <div className="dashboard__greeting">
          <h1 className="dashboard__title">Hola, John</h1>
          <p className="dashboard__subtitle">
            Gestiona tus reuniones y conecta con tu equipo
          </p>
        </div>

        <div className="dashboard__actions">
          <Link to="/meetings/create" className="dashboard__button dashboard__button--primary">
            <svg 
              className="dashboard__button-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 4V16M4 10H16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
            <span>Nueva reunión</span>
          </Link>
          
          <Link to="/meetings/join" className="dashboard__button dashboard__button--secondary">
            <svg 
              className="dashboard__button-icon dashboard__button-icon--secondary" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 4V16M4 10H16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
            <span>Unirse a una reunión</span>
          </Link>
        </div>

        <section className="dashboard__meetings">
          <h2 className="dashboard__meetings-title">Próximas reuniones</h2>
          <div className="dashboard__meetings-list">
            <div className="dashboard__meeting-item">
              <div className="dashboard__meeting-time">12:30 pm</div>
              <div className="dashboard__meeting-name">Reunión de Equipo</div>
            </div>
            <div className="dashboard__meeting-item">
              <div className="dashboard__meeting-time">14:00 pm</div>
              <div className="dashboard__meeting-name">Presentación del producto</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

