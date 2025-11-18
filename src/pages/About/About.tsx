import './About.scss';

export default function About() {
  return (
    <main className="about" role="main">
      <div className="about__container">
        <section className="about__hero">
          <h1>About Us</h1>
          <p className="about__intro">
            VideoConference Platform is a modern web application designed to facilitate 
            seamless communication and collaboration through high-quality video conferencing.
          </p>
        </section>

        <section className="about__section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a reliable, accessible, and user-friendly platform 
            for video conferencing that enables teams and individuals to connect effectively, 
            regardless of their location or technical expertise.
          </p>
        </section>

        <section className="about__section">
          <h2>Platform Features</h2>
          <ul className="about__features-list">
            <li>
              <strong>Multi-user Support:</strong> Host meetings with 2 to 10 participants
            </li>
            <li>
              <strong>Real-time Chat:</strong> Instant messaging during meetings
            </li>
            <li>
              <strong>Voice & Video:</strong> Full-duplex audio and high-quality video transmission
            </li>
            <li>
              <strong>Secure Authentication:</strong> Multiple authentication methods including OAuth
            </li>
            <li>
              <strong>Accessible Design:</strong> WCAG compliant interface for all users
            </li>
            <li>
              <strong>Responsive Interface:</strong> Works seamlessly on desktop and mobile devices
            </li>
          </ul>
        </section>

        <section className="about__section">
          <h2>Technology Stack</h2>
          <div className="about__tech-grid">
            <div className="about__tech-item">
              <h3>Frontend</h3>
              <p>Vite.js, React, TypeScript, SASS</p>
            </div>
            <div className="about__tech-item">
              <h3>Backend</h3>
              <p>Node.js, Express, TypeScript</p>
            </div>
            <div className="about__tech-item">
              <h3>Real-time</h3>
              <p>Socket.io, Peer.js, WebRTC</p>
            </div>
            <div className="about__tech-item">
              <h3>Database</h3>
              <p>Firebase Firestore</p>
            </div>
          </div>
        </section>

        <section className="about__section">
          <h2>Project Information</h2>
          <p>
            This project is part of the <strong>750018C PROYECTO INTEGRADOR I 2025-2</strong> course.
            It is developed using agile methodologies with sprints, focusing on progressive 
            feature implementation and continuous improvement.
          </p>
        </section>
      </div>
    </main>
  );
}

