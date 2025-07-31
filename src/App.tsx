// App.tsx

import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import PageLayout from './components/PageLayout';
import Home from './pages/Home';
import Lemonades from './pages/Lemonades';
import Rules from './pages/Rules';
import ParticleOrbitEffect from './components/lightswind/particleOrbitEffect';
import ShaderBackground from './components/lightswind/shadedBackground';
import Tea from './pages/Tea';
import Cocktails from './pages/Coctails';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {loading ? (
        <ParticleOrbitEffect className="absolute inset-0" />
      ) : (
        <div className="relative">
          <ShaderBackground className="absolute inset-0" color="#07EAC0" backdropBlurAmount="md" />
          <PageLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cocktails" element={<Cocktails />} />
              <Route path="/teas" element={<Tea />} />
              <Route path="/lemonades" element={<Lemonades />} />
              <Route path="/rules" element={<Rules />} />
            </Routes>
          </PageLayout>
        </div>
      )}
    </div>
  );
}

export default App;
