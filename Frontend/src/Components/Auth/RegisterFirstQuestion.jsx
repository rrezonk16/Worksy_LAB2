import React, { useEffect } from "react";
import { gsap } from "gsap";
import employee from "../../Assets/company.svg";
import work from "../../Assets/seeker.svg";

const RegisterFirstQuestion = ({ onSelectEmployee, onSelectSeeker }) => {
  useEffect(() => {
    gsap.set(".icon", { y: 0 }); 
  }, []);

  const handleHover = (iconClass) => {
    gsap.to(`.${iconClass}`, { y: -5, duration: 0.3, ease: "power1.out" });
  };

  const handleLeave = (iconClass) => {
    gsap.to(`.${iconClass}`, { y: 0, duration: 0.3, ease: "power1.out" });
  };

  return (
    <div className="text-center">
      <p className="text-lg font-semibold mb-6 text-gray-700">
        Are you looking for a job or an employee?
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-4 sm:space-y-0">
        <button
          className="w-full sm:w-auto px-6 py-3 flex items-center bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition"
          onClick={onSelectEmployee}
          onMouseEnter={() => handleHover("employee-icon")}
          onMouseLeave={() => handleLeave("employee-icon")}
        >
          <img
            src={employee}
            alt="Employee Icon"
            className="w-8 h-8 mr-2 icon employee-icon"
          />
          Looking for an Employee
        </button>

        <button
          className="w-full sm:w-auto px-6 py-3 flex items-center bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition"
          onClick={onSelectSeeker} // Make sure onSelectSeeker is passed correctly
          onMouseEnter={() => handleHover("work-icon")}
          onMouseLeave={() => handleLeave("work-icon")}
        >
          <img
            src={work}
            alt="Work Icon"
            className="w-8 h-8 mr-2 icon work-icon"
          />
          Looking for a Job
        </button>
      </div>
    </div>
  );
};

export default RegisterFirstQuestion;
