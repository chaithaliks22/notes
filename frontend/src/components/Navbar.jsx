import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, Home as HomeIcon, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('notenest-theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('notenest-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" id="navbar-brand-logo">
          <div className="brand-icon-wrapper">
            <BookOpen size={22} />
          </div>
          <span>NoteNest</span>
        </Link>

        {/* Navigation Links & Theme Toggle */}
        <nav className="navbar-links">
          <Link
            to="/"
            id="nav-home-link"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <HomeIcon size={18} />
            <span>Home</span>
          </Link>

          <Link
            to="/create"
            id="nav-create-btn"
            className="btn-primary"
          >
            <PlusCircle size={18} />
            <span>Add Note</span>
          </Link>

          {/* Dark / Light Mode Switcher */}
          <button
            type="button"
            className="theme-toggle-btn"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
