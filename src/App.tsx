import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Sitemap from './pages/Sitemap/Sitemap';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateMeeting from './pages/CreateMeeting/CreateMeeting';
import JoinMeeting from './pages/JoinMeeting/JoinMeeting';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/EditProfile/EditProfile';
import VideoConference from './pages/VideoConference/VideoConference';
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
    <AuthProvider>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/meetings/room" element={<VideoConference />} />
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
              <Route path="/meetings/join" element={<JoinMeeting />} />
              <Route path="/account" element={<Profile />} />
              <Route path="/account/edit" element={<EditProfile />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
    </AuthProvider>
  );
}

export default App;
