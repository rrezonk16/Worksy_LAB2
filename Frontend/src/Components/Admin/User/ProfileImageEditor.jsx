import React, { useState } from "react";
import { Pencil } from "lucide-react";
import axios from "axios";

const ProfileImageEditor = ({ imageUrl, onUploadSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("profile_image", selectedFile);

    try {
      await axios.post("http://127.0.0.1:8000/api/user/profile-image-update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile image updated.");
      setShowModal(false);
      onUploadSuccess?.(); // Optional callback
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    }
  };

  return (
    <div className="relative w-40 h-40 group">
      <img
        src={imageUrl}
        className="rounded-full w-full h-full object-cover border-4 border-gray-300"
        alt="Profile"
      />
      <div
        className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition"
        onClick={() => setShowModal(true)}
      >
        <Pencil className="text-white w-6 h-6" />
      </div>

      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Upload New Profile Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="block w-full text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImageEditor;
