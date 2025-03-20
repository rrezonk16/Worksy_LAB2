import React from "react";

import { Link } from "react-router-dom"; // Import Link for routing

const Main = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        WELCOME TO <span className="text-blue-600">WORKSY</span>
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        Find the perfect job or hire the best talent effortlessly!
      </p>

      <Link to="/register">
        <button className="register-btn px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
          REGISTER HERE
        </button>
      </Link>
      <Link to="/login">
        <button className="register-btn px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition mt-3.5">
          LOGIN HERE
        </button>
      </Link>
    </div>
  );
};

export default Main;
