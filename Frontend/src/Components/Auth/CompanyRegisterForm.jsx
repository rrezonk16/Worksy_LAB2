import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    nui: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/register/company",
        formData
      );

      localStorage.setItem("companyData", JSON.stringify(response.data));
      navigate("/company/panel/login");
    } catch (error) {
      setError(error.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br ">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register Your Company
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-center font-medium">
            {error.message || "Failed to register"}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "name", placeholder: "Company Name", type: "text" },
            { name: "nui", placeholder: "NUI", type: "text" },
            { name: "phone_number", placeholder: "Phone Number", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "password", placeholder: "Password", type: "password" },
            {
              name: "password_confirmation",
              placeholder: "Confirm Password",
              type: "password",
            },
          ].map((input, index) => (
            <input
              key={index}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/company/panel/login")}
            className="text-green-600 hover:underline cursor-pointer"
          >
            Sign in here
          </span>
        </p>
      </div>
    </div>
  );
};

export default CompanyRegisterForm;
