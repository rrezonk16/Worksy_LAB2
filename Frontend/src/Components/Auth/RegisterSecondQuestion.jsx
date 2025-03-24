import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import companyIcon from "../../Assets/company_building.svg";
import individualIcon from "../../Assets/company.svg";
import CompanyRegisterForm from "./CompanyRegisterForm"; // Import the form component

const RegisterSecondQuestion = () => {
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".employee-options",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" }
    );
  }, []);

  const handleHover = (iconClass) => {
    gsap.to(`.${iconClass}`, { y: -5, duration: 0.3, ease: "power1.out" });
  };

  const handleLeave = (iconClass) => {
    gsap.to(`.${iconClass}`, { y: 0, duration: 0.3, ease: "power1.out" });
  };

  return (
    <div className="employee-options mt-6 opacity-0 text-center">
      {!showCompanyForm ? (
        <>
          <p className="text-lg font-semibold text-gray-700">
            Are you a company or an individual?
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-x-0 sm:space-x-6 space-y-4 sm:space-y-0 mt-4">
            <button
              className="px-6 py-3 flex items-center bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition transform"
              onMouseEnter={() => handleHover("company-icon")}
              onMouseLeave={() => handleLeave("company-icon")}
              onClick={() => setShowCompanyForm(true)} // Open form on click
            >
              <img
                src={companyIcon}
                alt="Company Icon"
                className="w-8 h-8 mr-2 company-icon"
              />
              Company
            </button>

            <button
              className="px-6 py-3 flex items-center bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition transform"
              onMouseEnter={() => handleHover("individual-icon")}
              onMouseLeave={() => handleLeave("individual-icon")}
            >
              <img
                src={individualIcon}
                alt="Individual Icon"
                className="w-8 h-8 mr-2 individual-icon"
              />
              Individual
            </button>
          </div>
        </>
      ) : (
        <CompanyRegisterForm />
      )}
    </div>
  );
};

export default RegisterSecondQuestion;
