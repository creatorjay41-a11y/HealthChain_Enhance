import { Menu, X, Shield, Activity, BarChart3, FileText, Bluetooth } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  scrollY?: number;
}

export default function Navbar({ scrollY = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = scrollY > 50;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Monitor', path: '/monitor', icon: Activity },
    { label: 'History', path: '/history', icon: FileText },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Risk', path: '/risk', icon: Activity },
    { label: 'Bluetooth', path: '/bluetooth', icon: Bluetooth },
  ];

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ${
        isScrolled ? 'top-2' : 'top-4'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl shadow-2xl shadow-blue-200/20 transition-all duration-500 ${
          isScrolled ? 'py-3' : 'py-4'
        }`}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 2px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        <div className="px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-300/50">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                HealthChain
              </h1>
              <p className="text-xs text-slate-500 font-medium">Blockchain Healthcare</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/monitor" className="text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
              Monitor
            </Link>
            <Link to="/history" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              History
            </Link>
            <Link to="/analytics" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              Analytics
            </Link>
            <Link to="/risk" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              Risk
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-white/60 backdrop-blur-sm"
          >
            {isOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 px-6 pb-4 border-t border-white/40 pt-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/monitor" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" onClick={() => setIsOpen(false)}>
                Monitor
              </Link>
              <Link to="/history" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" onClick={() => setIsOpen(false)}>
                History
              </Link>
              <Link to="/analytics" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" onClick={() => setIsOpen(false)}>
                Analytics
              </Link>
              <Link to="/risk" className="text-slate-700 hover:text-blue-600 font-medium transition-colors" onClick={() => setIsOpen(false)}>
                Risk Assessment
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
