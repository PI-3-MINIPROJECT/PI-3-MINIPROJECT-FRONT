import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Sitemap from './pages/Sitemap/Sitemap';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateMeeting from './pages/CreateMeeting/CreateMeeting';
import './App.scss';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <Header />
      <div className="app__content">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/explore" element={<Dashboard />} />
              <Route path="/meetings/create" element={<CreateMeeting />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
