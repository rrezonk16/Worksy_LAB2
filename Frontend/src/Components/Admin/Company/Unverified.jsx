import React from 'react';
import logo from '../../../assets/logo_full.png';
import verification_icon from '../../../assets/search.png';
import { useNavigate } from 'react-router-dom';


const Unverified = () => {
    const navigate = useNavigate(); 
    const goBackToLogin = () => {
        navigate("/company/panel/login") ;
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center border border-gray-200">
        <img src={logo} alt="Logo" className="w-32 mx-auto mb-6" />
        <div className="flex items-center justify-center bg-gray-200 p-4 rounded-full w-24 h-24 mx-auto mb-4 shadow-md">
          <img src={verification_icon} alt="Verification Icon" className="w-12" />
        </div>
        <h1 className="text-2xl font-semibold">Unverified Company</h1>
        <p className="text-gray-600 mt-2">Your verification is in progress. Please wait.</p>
        <p className="text-sm text-gray-600 mt-4">
          For inquiries, contact{' '}
          <a href="mailto:admin@worksy.com" className="text-blue-600 hover:underline">
            admin@worksy.com
          </a>
        </p>
        <div className="mt-6">
          <button onClick={goBackToLogin} className="bg-blue-500 cursor-pointer hover:bg-blue-400 text-white px-6 py-2 rounded-lg shadow-md transition-all">
            GO BACK TO LOGIN
          </button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-gray-500 text-sm">&copy; 2025 Worksy. All rights reserved.</footer>
    </div>
  );
};

export default Unverified;
