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

      const responseData = response.data;

      // Save data to localStorage
      localStorage.setItem("companyData", JSON.stringify(responseData));

      // Redirect to verification page
      navigate("/company/panel/login");
    } catch (error) {
      setError(error.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 text-center">
        Register Your Company
      </h2>
      {error && (
        <p className="text-red-500 text-center mt-2">{error.message || "Failed to register"}</p>
      )}
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="nui"
          placeholder="NUI"
          value={formData.nui}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default CompanyRegisterForm;
