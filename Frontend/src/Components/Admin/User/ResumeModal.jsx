// ResumeModal.js
import React, { useState } from "react";

const ResumeModal = ({ showModal, setShowModal, handleFileChange, resumeFilename }) => {
  return (
    showModal && (
      <div className="modal-overlay">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md space-y-4">
          <h3 className="text-xl font-semibold">Upload Resume</h3>

          <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={handleFileChange}
          />
          {resumeFilename && (
            <div className="mt-2 text-sm text-gray-500">
              <strong>Selected File:</strong> {resumeFilename}
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500" id="file_input_help">
            PDF, DOCX, or TXT (MAX. 10MB).
          </p>

          <div className="flex justify-end gap-2">
            <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
          </div>
        </div>
      </div>
    )
  );
};

export default ResumeModal;
