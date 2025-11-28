import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.scss';

const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Sitemap = lazy(() => import('./pages/Sitemap/Sitemap'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const CreateMeeting = lazy(() => import('./pages/CreateMeeting/CreateMeeting'));
const JoinMeeting = lazy(() => import('./pages/JoinMeeting/JoinMeeting'));
const MeetingSuccess = lazy(() => import('./pages/MeetingSuccess/MeetingSuccess'));
const MeetingDetails = lazy(() => import('./pages/MeetingDetails/MeetingDetails'));
const MyMeetings = lazy(() => import('./pages/MyMeetings/MyMeetings'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile/EditProfile'));
const VideoConference = lazy(() => import('./pages/VideoConference/VideoConference'));

/**
 * Loading component displayed while lazy-loaded components are being loaded
 * @returns {JSX.Element} Loading spinner component
 */
function LoadingFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh' 
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3', 
        borderTop: '4px solid #3498db', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Layout component that wraps pages with Header and Footer
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} Layout component with header, content, and footer
 */
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <Header />
      <div className="app__content">
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

/**
 * Main App component that sets up routing and authentication context
 * @returns {JSX.Element} App component with routes and authentication provider
 */
function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
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
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="/explore" element={<Dashboard />} />
                    <Route path="/my-meetings" element={<MyMeetings />} />
                    <Route path="/meetings/create" element={<CreateMeeting />} />
                    <Route path="/meetings/join" element={<JoinMeeting />} />
                    <Route path="/meetings/success" element={<MeetingSuccess />} />
                    <Route path="/meetings/:meetingId" element={<MeetingDetails />} />
                    <Route path="/account" element={<Profile />} />
                    <Route path="/account/edit" element={<EditProfile />} />
                  </Routes>
                </Suspense>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
