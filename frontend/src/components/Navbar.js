import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-slate-800 bg-ink-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-acid rounded-md flex items-center justify-center">
              <span className="text-ink-950 font-display font-bold text-xs">SM</span>
            </div>
            <span className="font-display font-bold text-white text-sm tracking-tight">
              SkillMap<span className="text-acid">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-body transition-colors ${
                isActive('/dashboard') ? 'bg-acid/10 text-acid' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            {user && (
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-lg text-sm font-body transition-colors ${
                  isActive('/profile') ? 'bg-acid/10 text-acid' : 'text-slate-400 hover:text-white'
                }`}
              >
                Profile
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-7 h-7 bg-acid/20 rounded-full flex items-center justify-center">
                    <span className="text-acid text-xs font-display font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-400 font-body">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="ghost-btn text-xs">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="ghost-btn text-xs">Login</Link>
                <Link to="/register" className="acid-btn text-xs px-4 py-2">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
