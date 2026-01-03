import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import BackButton from './components/BackButton';
import FirstAid from './components/FirstAid';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState<'home' | 'first-aid' | 'monitoring' | 'history'>('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation based on current pathname
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('first-aid')) {
      setCurrentPage('first-aid');
    } else if (pathname.includes('monitoring')) {
      setCurrentPage('monitoring');
    } else if (pathname.includes('history')) {
      setCurrentPage('history');
    } else {
      setCurrentPage('home');
    }
  }, []);

  if (currentPage === 'first-aid') {
    return <FirstAid />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar scrollY={scrollY} />
      <Hero scrollY={scrollY} />
      <Features scrollY={scrollY} />
      <Footer />
      <BackButton />
    </div>
  );
}

export default App;
