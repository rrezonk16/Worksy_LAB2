import React from 'react';
import logo_full from '../../assets/logo_full.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');  // Check if token exists

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token from localStorage on logout
    navigate('/');  // Redirect to home page or login page after logout
  };

  return (
    <header className="flex justify-between items-center p-6">
      <div className="flex items-center space-x-2">
        <a href="/">
        <img src={logo_full} alt="Worksy Logo" className="h-10" /></a>
      </div>
      <div className="space-x-4">
        {!token ? (
          <>
            <button className="text-gray-800 font-medium">About Us</button>
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
    </header>
  );
};

export default Navbar;
