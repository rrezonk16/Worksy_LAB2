import React from 'react';
import logo from '../../../assets/logo_full.png';
import rejected_icon from '../../../assets/rejected.png';
import { useNavigate } from 'react-router-dom';


const Rejected = () => {
    const navigate = useNavigate(); 
  
    const goBackForVerification = () => {
        navigate("/company/verify") ;
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center border border-gray-200">
        <img src={logo} alt="Logo" className="w-32 mx-auto mb-6" />
        <div className="flex items-center justify-center bg-red-300 p-4 rounded-full w-24 h-24 mx-auto mb-4 shadow-md">
          <img src={rejected_icon} alt="Verification Icon" className="w-20 ml-4 mt-1" />
        </div>
        <h1 className="text-2xl font-semibold">Rejected Company</h1>
        <p className="text-gray-600 mt-2">Your verification is rejected</p>
        <p className="text-sm text-gray-600 mt-4">
          For inquiries, contact{' '}
          <a href="mailto:admin@worksy.com" className="text-blue-600 hover:underline">
            admin@worksy.com
          </a>
        </p>
        <div className="mt-6 flex flex-col gap-4">
        <button onClick={goBackForVerification} className="bg-green-600 cursor-pointer hover:bg-blue-400 text-white px-6 py-2 rounded-lg shadow-md transition-all">
            Try Again
          </button>  
        </div>
      </div>
      <footer className="absolute bottom-4 text-gray-500 text-sm">&copy; 2025 Worksy. All rights reserved.</footer>
    </div>
  );
};

export default Rejected;
