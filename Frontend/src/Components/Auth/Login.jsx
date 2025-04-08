import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login_background from "../../Assets/work.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login", formData);

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="hidden lg:block lg:w-1/2 h-full">
        <img
          className="w-full h-full object-cover rounded-r-4xl shadow-2xl"
          src={Login_background}
          alt="Login Background"
        />
      </div>

      <div className="w-full lg:w-1/2 h-full flex items-center justify-center text-center p-6">
        <div className="w-full sm:w-96 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>

            <div className="mt-4 text-sm text-blue-500 hover:text-blue-700 justify-between flex">
              <a href="/forgot-password">Forgot Password?</a>
              <a href="/register">Don't have an account?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
