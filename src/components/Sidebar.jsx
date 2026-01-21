import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex flex-col w-28 hover:w-36 fixed h-[calc(100vh-1.25rem)] top-2.5 left-2.5 rounded-2xl bg-primary-400 transition-all duration-300 z-40 shadow-large">
      <div className="p-4">
        <img
          src="https://img.icons8.com/ios/100/FFFFFF/heart-with-pulse.png"
          alt="FitTrack Logo"
          className="w-14 h-14 mx-auto"
        />
      </div>
      <nav className="flex-1 flex flex-col justify-center items-center gap-8">
        <Link
          to="/today"
          className={`text-white text-2xl p-6 rounded-2xl transition-all duration-200 ${
            location.pathname === '/today'
              ? 'bg-white bg-opacity-25'
              : 'hover:bg-white hover:bg-opacity-10'
          }`}
          aria-label="Today"
        >
          <i className="fas fa-calendar-day"></i>
        </Link>
        <Link
          to="/history"
          className={`text-white text-2xl p-6 rounded-2xl transition-all duration-200 ${
            location.pathname === '/history'
              ? 'bg-white bg-opacity-25'
              : 'hover:bg-white hover:bg-opacity-10'
          }`}
          aria-label="History"
        >
          <i className="fas fa-history"></i>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
