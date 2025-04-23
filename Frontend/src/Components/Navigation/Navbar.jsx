import React, { useState, useRef, useEffect } from 'react';
import logo_full from '../../assets/logo_full.png';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        menuRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.to(menuRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });
    }
  }, [menuOpen]);

  return (
    <header className="flex justify-between items-center p-6 shadow-md relative">
      <div className="flex items-center space-x-2">
        <a href="/">
          <img src={logo_full} alt="Worksy Logo" className="h-10" />
        </a>
      </div>

      <div className="hidden md:flex space-x-4 items-center">
        {!token ? (
          <>
            <button className="text-gray-800 font-medium">About Us</button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white"
            >
              Join now
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-800 font-medium"
            >
              Profile
            </button>
            <button
              onClick={() => navigate('/my-applications')}
              className="text-gray-800 font-medium"
            >
              My Applications
            </button>
            <button
              onClick={() => navigate('/job-listings')}
              className="text-gray-800 font-medium"
            >
              View Jobs
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        ref={menuRef}
        className={`absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 space-y-3 md:hidden z-50 ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        {!token ? (
          <>
            <button className="text-gray-800 font-medium">About Us</button>
            <button
              onClick={() => {
                navigate('/login');
                setMenuOpen(false);
              }}
              className="w-full text-left"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate('/register');
                setMenuOpen(false);
              }}
              className="w-full text-left"
            >
              Join now
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                navigate('/profile');
                setMenuOpen(false);
              }}
              className="w-full text-left"
            >
              Profile
            </button>
            <button
              onClick={() => {
                navigate('/my-applications');
                setMenuOpen(false);
              }}
              className="w-full text-left"
            >
              My Applications
            </button>
            <button
              onClick={() => {
                navigate('/job-listings');
                setMenuOpen(false);
              }}
              className="w-full text-left"
            >
              View Jobs
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
