import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-5 left-5 right-5 bg-primary-400 rounded-2xl shadow-large h-20 flex items-center justify-around z-40">
      <Link
        to="/today"
        className={`flex flex-col items-center justify-center text-white transition-all duration-200 ${
          location.pathname === '/today' ? 'opacity-100' : 'opacity-70'
        }`}
        aria-label="Today"
      >
        <i className="fas fa-calendar-day text-xl mb-1"></i>
        <span className="text-xs font-semibold">Today</span>
      </Link>
      <Link
        to="/insights"
        className={`flex flex-col items-center justify-center text-white transition-all duration-200 ${
          location.pathname === '/insights' ? 'opacity-100' : 'opacity-70'
        }`}
        aria-label="Insights"
      >
        <i className="fas fa-chart-line text-xl mb-1"></i>
        <span className="text-xs font-semibold">Insights</span>
      </Link>
      <Link
        to="/goals"
        className={`flex flex-col items-center justify-center text-white transition-all duration-200 ${
          location.pathname === '/goals' ? 'opacity-100' : 'opacity-70'
        }`}
        aria-label="Goals"
      >
        <i className="fas fa-bullseye text-xl mb-1"></i>
        <span className="text-xs font-semibold">Goals</span>
      </Link>
      <Link
        to="/history"
        className={`flex flex-col items-center justify-center text-white transition-all duration-200 ${
          location.pathname === '/history' ? 'opacity-100' : 'opacity-70'
        }`}
        aria-label="History"
      >
        <i className="fas fa-history text-xl mb-1"></i>
        <span className="text-xs font-semibold">History</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
