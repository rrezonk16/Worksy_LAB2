import React from "react";
import { useLocation } from "react-router-dom";

const Welcome = () => {
  const location = useLocation();
  const { name, email } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {name}!</h1>
      <p className="text-xl text-gray-600">Your email: {email}</p>
    </div>
  );
};

export default Welcome;
