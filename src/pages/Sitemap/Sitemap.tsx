import { Link } from 'react-router-dom';
import './Sitemap.scss';

/**
 * Sitemap page component displaying all available pages and sections
 * Provides navigation overview of the entire platform
 * @returns {JSX.Element} Sitemap page with site structure
 */
export default function Sitemap() {
  return (
    <main className="sitemap" role="main">
      <div className="sitemap__container">
        <h1>Mapa del Sitio</h1>
        <p className="sitemap__intro">
          Navega por todas las páginas y secciones disponibles de la plataforma.
        </p>

        <section className="sitemap__section">
          <h2>Páginas Públicas</h2>
          <ul className="sitemap__list">
            <li>
              <Link to="/">Inicio</Link>
              <span className="sitemap__description">Página principal con características y llamados a la acción</span>
            </li>
            <li>
              <Link to="/about">Sobre Nosotros</Link>
              <span className="sitemap__description">Información sobre la plataforma y el proyecto</span>
            </li>
            <li>
              <Link to="/sitemap">Mapa del Sitio</Link>
              <span className="sitemap__description">Esta página - estructura general del sitio</span>
            </li>
          </ul>
        </section>

        <section className="sitemap__section">
          <h2>Autenticación</h2>
          <ul className="sitemap__list">
            <li>
              <Link to="/login">Iniciar sesión</Link>
              <span className="sitemap__description">Página de autenticación de usuario</span>
            </li>
            <li>
              <Link to="/register">Registro</Link>
              <span className="sitemap__description">Registro de nuevo usuario</span>
            </li>
            <li>
              <Link to="/forgot-password">Recuperar contraseña</Link>
              <span className="sitemap__description">Recuperación de contraseña</span>
            </li>
          </ul>
        </section>

        <section className="sitemap__section">
          <h2>Panel de Usuario</h2>
          <ul className="sitemap__list">
            <li>
              <Link to="/dashboard">Dashboard</Link>
              <span className="sitemap__description">Panel principal del usuario con acceso rápido</span>
            </li>
            <li>
              <Link to="/profile">Perfil</Link>
              <span className="sitemap__description">Ver y gestionar información del perfil</span>
            </li>
            <li>
              <Link to="/profile/edit">Editar Perfil</Link>
              <span className="sitemap__description">Modificar datos personales y preferencias</span>
            </li>
            <li>
              <Link to="/meetings">Mis Reuniones</Link>
              <span className="sitemap__description">Lista de reuniones creadas y programadas</span>
            </li>
            <li>
              <Link to="/meetings/create">Crear Reunión</Link>
              <span className="sitemap__description">Crear una nueva sala de reunión</span>
            </li>
            <li>
              <Link to="/meetings/join">Unirse a Reunión</Link>
              <span className="sitemap__description">Unirse a una reunión existente con código</span>
            </li>
          </ul>
        </section>

        <section className="sitemap__section">
          <h2>Videoconferencia</h2>
          <ul className="sitemap__list">
            <li>
              <Link to="/explore">Explorar</Link>
              <span className="sitemap__description">Buscar y acceder a reuniones disponibles</span>
            </li>
            <li>
              <span className="sitemap__disabled">Sala de Reunión</span>
              <span className="sitemap__description">Interfaz de videoconferencia con chat, audio y video (acceso mediante unión a reunión)</span>
            </li>
          </ul>
        </section>

        <section className="sitemap__section">
          <h2>Estructura del Sitio</h2>
          <div className="sitemap__tree">
            <ul>
              <li>
                <strong>/</strong> (Inicio)
                <ul>
                  <li><strong>/about</strong> (Sobre Nosotros)</li>
                  <li><strong>/sitemap</strong> (Mapa del Sitio)</li>
                  <li><strong>/login</strong> (Iniciar sesión)</li>
                  <li><strong>/register</strong> (Registro)</li>
                  <li><strong>/forgot-password</strong> (Recuperar contraseña)</li>
                  <li><strong>/reset-password</strong> (Restablecer contraseña)</li>
                  <li>
                    <strong>/dashboard</strong> (Panel de Usuario)
                    <ul>
                      <li><strong>/profile</strong> (Ver Perfil)</li>
                      <li><strong>/profile/edit</strong> (Editar Perfil)</li>
                      <li><strong>/explore</strong> (Explorar Reuniones)</li>
                      <li><strong>/meetings</strong> (Mis Reuniones)</li>
                      <li><strong>/meetings/create</strong> (Crear Reunión)</li>
                      <li><strong>/meetings/join</strong> (Unirse a Reunión)</li>
                      <li><strong>/meetings/:id</strong> (Detalles de Reunión)</li>
                      <li><strong>/meetings/:id/success</strong> (Reunión Creada)</li>
                      <li><strong>/meeting/:meetingId</strong> (Sala de Videoconferencia)</li>
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

