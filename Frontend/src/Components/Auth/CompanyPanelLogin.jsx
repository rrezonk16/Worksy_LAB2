import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo_full.png";

const CompanyPanelLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/company-user/login",
        formData
      );

      const { token, company_verification_status } = response.data;
      console.log(response);
      
      localStorage.setItem("company_user_token", token);
      localStorage.setItem("company_name", response.data.user.company.name);

      if (company_verification_status === "pending") {
        navigate("/company/verify");
      } else if (company_verification_status === "approved") {
        navigate("/company/dashboard");
      }
      else if (company_verification_status === "uploaded") {
        navigate("/company/uploaded-documents");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo */}
      <img src={logo} alt="Worksy Logo" className="w-40 mb-6 animate-fadeIn" />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">
          Company Panel Login
        </h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-gray-500 text-sm">
        Worksy © 2025
      </footer>
    </div>
  );
};

export default CompanyPanelLogin;
