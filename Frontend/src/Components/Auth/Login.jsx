import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router v6
import gsap from "gsap";
import Login_background from "../../Assets/work.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation

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

    // Simulate API login request
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("permissions", JSON.stringify(data.permissions));

        // Trigger success animation and redirect after animation
        setSuccess(true);
        gsap.fromTo(
          ".green-tick", // Animate the green tick first
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 1.5, onComplete: triggerGreenFlash }
        );
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      alert("An error occurred!");
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  const triggerGreenFlash = () => {
    // Animate the green flash effect after the checkmark animation
    gsap.to(".green-flash", {
      opacity: 1,
      duration: 0.5,
      onComplete: () => redirectToMainPage(),
    });
  };

  const redirectToMainPage = () => {
    // Redirect to main page after the flash
    navigate("/main");
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

          {/* Green flash effect */}
          {success && (
            <div className="green-flash absolute top-0 left-0 right-0 bottom-0 bg-blue-300 opacity-0">
              <div className="green-tick absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                <svg
                  className="w-20 h-20 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 4.293a1 1 0 00-1.414 0L8 11.586 4.707 8.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
