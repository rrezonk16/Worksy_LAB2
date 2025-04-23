import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import axios from "axios";
import IconLoading from "../Loaders/IconLoading";
import { useNavigate } from "react-router-dom";

const IndividualSeekerForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    birthday: "",
    phone_number: "",
    gender: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: 1,
    acceptedTerms: false,
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      acceptedTerms: !prevData.acceptedTerms,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      

      const response = await axios.post("http://localhost:8000/api/register/user", formData);
      console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (response.status === 201) {
        navigate("/user-profile", {
          state: {
            name: formData.name,
            email: formData.email,
          },
        });
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  useEffect(() => {
    gsap.fromTo(".form-container", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="form-container bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm text-gray-700">Surname</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="birthday" className="block text-sm text-gray-700">Birthday</label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm text-gray-700">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
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
                <label htmlFor="password" className="block text-sm text-gray-700">Password</label>
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

              <div>
                <label htmlFor="password_confirmation" className="block text-sm text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightblue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleCheckboxChange}
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I accept the <a href="/terms" className="text-blue-500">Terms and Conditions</a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                disabled={!formData.acceptedTerms}
              >
                Register
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default IndividualSeekerForm;
