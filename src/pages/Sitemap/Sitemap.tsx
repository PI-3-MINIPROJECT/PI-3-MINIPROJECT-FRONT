import { Link } from 'react-router-dom';
import './Sitemap.scss';

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
              <span className="sitemap__description">Perfil de usuario y configuraciones</span>
            </li>
            <li>
              <Link to="/meetings">Mis Reuniones</Link>
              <span className="sitemap__description">Lista de reuniones del usuario</span>
            </li>
            <li>
              <Link to="/meetings/create">Crear Reunión</Link>
              <span className="sitemap__description">Crear una nueva sala de reunión</span>
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
                  <li>
                    <strong>/about</strong> (Sobre Nosotros)
                  </li>
                  <li>
                    <strong>/sitemap</strong> (Mapa del Sitio)
                  </li>
                  <li>
                    <strong>/login</strong> (Iniciar sesión)
                  </li>
                  <li>
                    <strong>/register</strong> (Registro)
                  </li>
                  <li>
                    <strong>/forgot-password</strong> (Recuperar contraseña)
                  </li>
                  <li>
                    <strong>/dashboard</strong> (Panel de Usuario)
                    <ul>
                      <li>
                        <strong>/meetings</strong> (Mis Reuniones)
                      </li>
                      <li>
                        <strong>/meetings/create</strong> (Crear Reunión)
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

