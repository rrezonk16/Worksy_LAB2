// ProfileModal.js
import React, { useState } from "react";

const ProfileModal = ({ showModal, setShowModal, handleFileChange, resumeFilename }) => {
  return (
    showModal && (
      <div className="modal-overlay">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-md space-y-4">
          <h3 className="text-xl font-semibold">Upload New Profile Image</h3>
          <div className="drag-box">
            <p>Drag & drop your image here, or click to select</p>
            <input
              type="file"
              accept="image/*"
              className="w-full opacity-0 absolute inset-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
          {resumeFilename && (
            <div className="mt-2 text-sm text-gray-500">
              <strong>Selected File:</strong> {resumeFilename}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileModal;
