import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import PageLayout from './components/PageLayout';
import ParticleOrbitEffect from './components/lightswind/particleOrbitEffect';
import ShaderBackground from './components/lightswind/shadedBackground';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './services/firebase';
import AgeVerificationPage from './pages/AgeVerificationPage';

const Home = lazy(() => import('./pages/Home'));
const Lemonades = lazy(() => import('./pages/Lemonades'));
const Rules = lazy(() => import('./pages/Rules'));
const Tea = lazy(() => import('./pages/Tea'));
const Profile = lazy(() => import('./pages/Profile'));
const NotAuth = lazy(() => import('./pages/NotAuth'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const VisitsHistoryPage = lazy(() => import('./pages/VisitsHistoryPage'));
const Cocktails = lazy(() => import('./pages/Cocktails'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));

function App() {
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {

    const ageVerified = localStorage.getItem('ageVerified');
    if (ageVerified === 'true') {
      setIsAgeVerified(true);
    }
  }, []);

  const handleAgeVerification = () => {
    setIsAgeVerified(true);
    localStorage.setItem('ageVerified', 'true');
  };

  const handleDenyAgeVerification = () => {
    window.location.href = 'https://www.ivi.ru/';
  };


  const isAuthPage = location.pathname === '/auth-page';
  const isAdminDashboard = location.pathname === '/admin';
  const isVisitsHistory = location.pathname === '/visits-history/this';

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-black text-white`}>
        <ToastContainer position="top-center" />
        {loading ? (
          <ParticleOrbitEffect className="absolute inset-0" />
        ) : (
          <div className="relative">
            {!isAgeVerified && (
              <AgeVerificationPage
                onConfirm={handleAgeVerification}
                onDeny={handleDenyAgeVerification}
              />
            )}
            {isAgeVerified && (
              <>

                {!isAuthPage && !isAdminDashboard && !isVisitsHistory && (
                  <ShaderBackground className="absolute inset-0" color="#07EAC0" backdropBlurAmount="md" />
                )}
                <PageLayout>
                  <Suspense fallback={<div className="spinner-container">
                    <div className="spinner"></div>
                  </div>}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/cocktails-page-:cocktail" element={<Cocktails />} />
                      <Route path="/teas-slug-:tea" element={<Tea />} />
                      <Route path="/lemonades/fruit-flavored" element={<Lemonades />} />
                      <Route path="/rules/command-guidelines" element={<Rules />} />
                      <Route path="/profile/tab=settings" element={<Profile />} />
                      <Route path="/not-auth" element={<NotAuth />} />
                      <Route path="/auth-page" element={<AuthPage />} />
                      <Route path="/visits-history/this" element={<VisitsHistoryPage />} />
                      <Route path="/achievements-:userId" element={user ? <AchievementsPage userId={user.uid} /> : <Navigate to="/auth-page" />} />
                      <Route path="/admin" element={<PrivateRoute adminOnly={true} element={<AdminDashboard />} />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </PageLayout>
              </>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
