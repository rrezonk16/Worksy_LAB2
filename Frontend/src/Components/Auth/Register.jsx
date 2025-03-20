import React, { useState } from "react";
import RegisterFirstQuestion from "./RegisterFirstQuestion";
import RegisterSecondQuestion from "./RegisterSecondQuestion";
import IndividualSeekerForm from "./IndividualSeekerForm"; // Import IndividualSeekerForm
import register_background from "../../Assets/work.jpg";

const Register = () => {
  const [showSecondQuestion, setShowSecondQuestion] = useState(false);
  const [showSeekerForm, setShowSeekerForm] = useState(false);

  const handleSelectEmployee = () => {
    setShowSecondQuestion(true);
    setShowSeekerForm(false);
  };

  const handleSelectSeeker = () => {
    setShowSeekerForm(true);
    setShowSecondQuestion(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="hidden lg:block lg:w-1/2 h-full">
        <img
          className="w-full h-full object-cover rounded-r-4xl shadow-2xl"
          src={register_background}
          alt="Register Background"
        />
      </div>

      <div className="w-full lg:w-1/2 h-full flex items-center justify-center text-center p-6">
        {!showSecondQuestion && !showSeekerForm && (
          <RegisterFirstQuestion 
            onSelectEmployee={handleSelectEmployee} 
            onSelectSeeker={handleSelectSeeker} 
          />
        )}

        {showSecondQuestion && <RegisterSecondQuestion />}
        {showSeekerForm && <IndividualSeekerForm />}
      </div>
    </div>
  );
};

export default Register;
