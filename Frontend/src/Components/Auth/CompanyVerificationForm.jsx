import React, { useState } from "react";
import axios from "axios";
import logo from "../../assets/logo_full.png"; // Import the logo

const ApplyForVerificationForm = () => {
  const [files, setFiles] = useState({
    company_certificate: null,
    owner_id_front: null,
    owner_id_back: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const token = localStorage.getItem("company_user_token");

    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("company_certificate", files.company_certificate);
    formData.append("owner_id_front", files.owner_id_front);
    formData.append("owner_id_back", files.owner_id_back);

    try {
      await axios.post("http://localhost:8000/api/apply-for-verification", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Verification request submitted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo */}
      <img src={logo} alt="Worksy Logo" className="w-40 mt-20" />

      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Apply for Verification
        </h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mt-2">{successMessage}</p>}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            {/* File Upload Box */}
            {[
              { name: "company_certificate", label: "Company Certificate" },
              { name: "owner_id_front", label: "Owner ID (Front)" },
              { name: "owner_id_back", label: "Owner ID (Back)" },
            ].map((file, index) => (
              <div key={index} className="flex flex-col items-center border border-gray-300 rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition relative">
                <label className="text-gray-700 font-medium text-center">{file.label}</label>
                <input
                  type="file"
                  name={file.name}
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  required
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                {/* Show selected file name */}
                <span className="mt-2 text-xs text-gray-500 text-center">
                  {files[file.name] ? files[file.name].name : "No file chosen"}
                </span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Verification"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="text-gray-500 text-sm mt-6 pb-4">
        Worksy © 2025
      </footer>
    </div>
  );
};

export default ApplyForVerificationForm;
