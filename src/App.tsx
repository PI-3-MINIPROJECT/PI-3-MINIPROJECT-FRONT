import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Sitemap from './pages/Sitemap/Sitemap';
import './App.scss';

/**
 * Main App component
 * Sets up routing and layout structure
 */
function App() {
  return (
    <div className="app">
      <Header />
      <div className="app__content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
