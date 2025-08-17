import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; // Импортируем ToastContainer
import PageLayout from './components/PageLayout';
import Home from './pages/Home';
import Lemonades from './pages/Lemonades';
import Rules from './pages/Rules';
import ParticleOrbitEffect from './components/lightswind/particleOrbitEffect';
import ShaderBackground from './components/lightswind/shadedBackground';
import Tea from './pages/Tea';
import Profile from './pages/Profile';
import NotAuth from './pages/NotAuth';
import AuthPage from './pages/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import Cocktails from './pages/Coctails';


function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const isAuthPage = location.pathname === '/auth-page';

  return (
    <div className={`min-h-screen bg-black text-white ${isAuthPage ? 'bgI' : 'bg-black'}`}>
      <ToastContainer position="top-center" />
      {loading ? (
        <ParticleOrbitEffect className="absolute inset-0" />
      ) : (
        <div className="relative">
          {!isAuthPage && (
            <ShaderBackground className="absolute inset-0" color="#07EAC0" backdropBlurAmount="md" />
          )}
          <PageLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cocktails" element={<Cocktails />} />
              <Route path="/teas" element={<Tea />} />
              <Route path="/lemonades" element={<Lemonades />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/not-auth" element={<NotAuth />} />
              <Route path="/auth-page" element={<AuthPage />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly={true} element={<AdminDashboard />} />
                }
              />
            </Routes>
          </PageLayout>
        </div>
      )}
    </div>
  );
}

export default App;
