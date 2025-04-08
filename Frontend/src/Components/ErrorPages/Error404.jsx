import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo_full.png';

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
      <img src={logo} alt="Logo" className="w-40 mb-6" />
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mt-2">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition">
        Go Back Home
      </Link>
    </div>
  );
};

export default Error404;
