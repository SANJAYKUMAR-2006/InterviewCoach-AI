import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Mic, Award } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Practice', path: '/setup' },
    { name: 'History', path: '/history' },
    { name: 'Tips', path: '/tips' }
  ];

  return (
    <nav className="sticky top-0 z-50 glassmorphism shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-bold text-xl tracking-tight">
            <div className="bg-primary-500 text-white p-1.5 rounded-lg">
              <Mic className="h-5 w-5" />
            </div>
            <span>InterviewCoach <span className="text-slate-700 dark:text-slate-200">AI</span></span>
          </Link>

          {/* Nav items */}
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors duration-200 py-1.5 px-3 rounded-md ${
                      isActive 
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40' 
                        : 'text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
              id="theme-toggle-btn"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
