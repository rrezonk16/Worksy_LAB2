import React from "react";
import { useNavigate } from "react-router-dom";

const Subscribe = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("company_user_token");

  const handleSubscribe = (plan, amount) => {
    if (!isLoggedIn) {
      navigate("/company/panel/login")
      return;
    }

    navigate("/checkout", {
      state: { plan, amount },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">
            Subscribe to Premium
          </h1>
          <p className="text-lg text-center text-gray-600 mb-10">
            Unlock exclusive features and grow your company's reach!
          </p>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition-transform">
              <h2 className="text-2xl font-semibold mb-2">Monthly</h2>
              <p className="text-4xl font-bold mb-4 text-green-500">€9.99</p>
              <ul className="text-gray-600 mb-6 space-y-2 text-center">
                <li>Custom Job Questions</li>
                <li>Access Premium Jobs</li>
                <li>Priority Support</li>
              </ul>
              <button
                onClick={() => handleSubscribe("monthly", 9.99)}
                className="bg-green-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Subscribe Monthly
              </button>
            </div>

            {/* 3 Months Plan */}
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition-transform border-2 border-green-500">
              <h2 className="text-2xl font-semibold mb-2">3 Months</h2>
              <p className="text-4xl font-bold mb-4 text-green-500">€19.99</p>
              <ul className="text-gray-600 mb-6 space-y-2 text-center">
                <li>Custom Job Questions</li>
                <li>Access Premium Jobs</li>
                <li>Priority Support</li>
                <li>Featured Company Badge</li>
              </ul>
              <button
                onClick={() => handleSubscribe("3months", 19.99)}
                className="bg-green-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Subscribe 3 Months
              </button>
            </div>

            {/* Yearly Plan */}
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition-transform">
              <h2 className="text-2xl font-semibold mb-2">Yearly</h2>
              <p className="text-4xl font-bold mb-4 text-green-500">€99.99</p>
              <ul className="text-gray-600 mb-6 space-y-2 text-center">
                <li>Custom Job Questions</li>
                <li>Access Premium Jobs</li>
                <li>Priority Support</li>
                <li>Featured Company Badge</li>
                <li>Personalized Hiring Help</li>
              </ul>
              <button
                onClick={() => handleSubscribe("yearly", 99.99)}
                className="bg-green-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Subscribe Yearly
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
