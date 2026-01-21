import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-5 left-5 right-5 bg-primary-400 rounded-2xl shadow-large h-24 flex items-center justify-around z-40">
      <Link
        to="/today"
        className={`flex flex-col items-center justify-center text-white transition-all duration-200 ${
          location.pathname === '/today' ? 'opacity-100' : 'opacity-70'
        }`}
        aria-label="Today"
      >
        <img
          src="https://img.icons8.com/ios-filled/50/FFFFFF/sun--v1.png"
          alt="Today"
          className="w-8 h-8 mb-1"
        />
        <span className="text-xs font-semibold">Today</span>
      </Link>
      <Link
        to="/history"
        className={`flex flex-col items-center justify-center text-white transition-all duration-200 ${
          location.pathname === '/history' ? 'opacity-100' : 'opacity-70'
        }`}
        aria-label="History"
      >
        <img
          src="https://img.icons8.com/ios-filled/50/FFFFFF/time-machine.png"
          alt="History"
          className="w-8 h-8 mb-1"
        />
        <span className="text-xs font-semibold">History</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
