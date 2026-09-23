import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { Footer } from '../components/navigation/Footer';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-[#F8FAFC] transition-colors">
      {isLandingPage ? <LandingNavbar /> : <Navbar showSearch={false} />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

