import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import RealTimeMonitoring from './pages/RealTimeMonitoring';
import HealthHistory from './pages/HealthHistory';
import HealthAnalytics from './pages/HealthAnalytics';
import HealthRiskPrediction from './pages/HealthRiskPrediction';
import BluetoothHealthMonitor from './pages/BluetoothHealthMonitor';

function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar scrollY={scrollY} />
      <Hero scrollY={scrollY} />
      <Features scrollY={scrollY} />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/monitor" element={<RealTimeMonitoring />} />
        <Route path="/history" element={<HealthHistory />} />
        <Route path="/analytics" element={<HealthAnalytics />} />
        <Route path="/risk" element={<HealthRiskPrediction />} />
        <Route path="/bluetooth" element={<BluetoothHealthMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;
