import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../data/landingData';
import { Activity, Sun, Moon, Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export const LandingNavbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { role, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'features', 'solutions', 'traffic', 'analytics'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      setActiveSection(targetId);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveSection('home');
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-md py-3'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Title */}
          <a href="#home" onClick={handleLogoClick} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-[#2563EB]/25 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white">
                UrbanPulse <span className="text-[#2563EB]">Nexus</span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                AI Smart City Platform
              </span>
            </div>
          </a>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800">
            {NAV_LINKS.map((link) => {
              const targetId = link.href.replace('#', '');
              const isActive = activeSection === targetId;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-slate-800/80'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Stable Desktop Header Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 border border-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>

            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-bold text-slate-300 hover:text-[#2563EB]">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="sm" className="font-bold border-slate-800 text-slate-300 hover:bg-slate-800">
                Register
              </Button>
            </Link>

            {!isLoading && role !== 'guest' && user ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(role === 'admin' ? '/admin/dashboard' : role === 'staff' ? '/staff/dashboard' : '/citizen/dashboard')}
                leftIcon={<UserCheck className="w-4 h-4" />}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 font-bold shadow-md"
              >
                Dashboard
              </Button>
            ) : (
              <Link to="/register">
                <Button variant="primary" size="sm" className="bg-[#2563EB] hover:bg-[#2563EB]/90 font-bold shadow-md shadow-[#2563EB]/20" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <nav className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => {
                const targetId = link.href.replace('#', '');
                const isActive = activeSection === targetId;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-slate-800 text-slate-300">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-slate-800 text-slate-300">Register</Button>
              </Link>
              {!isLoading && role !== 'guest' && user ? (
                <Button
                  variant="primary"
                  className="w-full bg-[#2563EB]"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(role === 'admin' ? '/admin/dashboard' : role === 'staff' ? '/staff/dashboard' : '/citizen/dashboard');
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full bg-[#2563EB]" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
