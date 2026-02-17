import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="noise-overlay" aria-hidden="true"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center text-center px-4">
            <div>
              <p className="font-display font-bold text-8xl text-acid/20">404</p>
              <p className="text-slate-400 text-lg font-body mt-4">Page not found</p>
              <a href="/" className="acid-btn inline-block mt-6">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
