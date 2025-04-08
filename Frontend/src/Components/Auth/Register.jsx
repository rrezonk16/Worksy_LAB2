import React, { useState } from "react";
import RegisterFirstQuestion from "./RegisterFirstQuestion";
import RegisterSecondQuestion from "./RegisterSecondQuestion";
import IndividualSeekerForm from "./IndividualSeekerForm";
import register_background from "../../Assets/work.jpg";

const Register = () => {
  const [history, setHistory] = useState(["first"]);

  const handleSelectEmployee = () => {
    setHistory((prev) => [...prev, "second"]);
  };

  const handleSelectSeeker = () => {
    setHistory((prev) => [...prev, "seeker"]);
  };

  const handleBack = () => {
    setHistory((prev) => prev.slice(0, -1)); // Remove the last step
  };

  const currentStep = history[history.length - 1];

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="hidden lg:block lg:w-1/2 h-full">
        <img
          className="w-full h-full object-cover rounded-r-4xl shadow-2xl"
          src={register_background}
          alt="Register Background"
        />
      </div>

      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center text-center p-6">
        {currentStep !== "first" && (
          <button
            onClick={handleBack}
            className="absolute top-5 left-5 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Back
          </button>
        )}

        {currentStep === "first" && (
          <RegisterFirstQuestion 
            onSelectEmployee={handleSelectEmployee} 
            onSelectSeeker={handleSelectSeeker} 
          />
        )}

        {currentStep === "second" && <RegisterSecondQuestion />}
        {currentStep === "seeker" && <IndividualSeekerForm />}
      </div>
    </div>
  );
};

export default Register;
