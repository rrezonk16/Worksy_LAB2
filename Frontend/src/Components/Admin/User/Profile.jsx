import React, { useEffect, useState } from "react";
import Navbar from "../../Navigation/Navbar";
import Footer from "../../Navigation/Footer";
import axios from "axios";
import { Pencil } from "lucide-react";
import "./modal.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        setFormData(res.data.user);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["birthday", "gender", "bio", "skills_tag"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = () => {
    axios
      .put("http://127.0.0.1:8000/api/me/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        alert("Profile updated successfully");
        setUser(res.data.user);
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };

  const handleProfileUpload = () => {
    const data = new FormData();
    data.append("profile_image", profileImage);

    axios
      .post("http://127.0.0.1:8000/api/profile-image", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Profile image uploaded");
        setShowProfileModal(false);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  const handleResumeUpload = () => {
    const data = new FormData();
    data.append("resume", resumeFile);

    axios
      .post("http://127.0.0.1:8000/api/upload-resume", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Resume uploaded");
        setShowResumeModal(false);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  if (!user) return <div className="p-6">Loading...</div>;

  const {
    name,
    surname,
    email,
    phone_number,
    created_at,
    updated_at,
    details,
  } = formData;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

        <div className="flex justify-end mb-4 gap-4">
          {isEditing && (
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 group">
            <img
              src={
                user.details?.profile_image || "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="rounded-full w-full h-full object-cover border-4 border-gray-300"
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition"
              onClick={() => setShowProfileModal(true)}
            >
              <Pencil className="text-white w-6 h-6" />
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <strong>Name:</strong>
              {isEditing ? (
                <div>
                  <input
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="w-full mt-1 border p-2 rounded"
                  />
                  <strong>Surname:</strong>
                  <input
                    name="surname"
                    value={surname}
                    onChange={handleChange}
                    className="w-full mt-1 border p-2 rounded"
                  />
                </div>
              ) : (
                <span className="ml-2 text-xl">
                  {user.name} {user.surname}
                </span>
              )}
            </div>
            <div>
              <strong>Email:</strong>
              {isEditing ? (
                <input
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full mt-1 border p-2 rounded"
                />
              ) : (
                <span className="ml-2">{user.email}</span>
              )}
            </div>
            <div>
              <strong>Phone:</strong>
              {isEditing ? (
                <input
                  name="phone_number"
                  value={phone_number}
                  onChange={handleChange}
                  className="w-full mt-1 border p-2 rounded"
                />
              ) : (
                <span className="ml-2">{user.phone_number}</span>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Created: {new Date(created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 mt-6 space-y-4">
          <div>
            <strong>Birthday:</strong>
            {isEditing ? (
              <input
                type="date"
                name="birthday"
                value={details?.birthday || ""}
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded"
              />
            ) : (
              <span className="ml-2">{details?.birthday || "N/A"}</span>
            )}
          </div>
          <div>
            <strong>Gender:</strong>
            {isEditing ? (
              <input
                type="text"
                name="gender"
                value={details?.gender || ""}
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded"
              />
            ) : (
              <span className="ml-2">{details?.gender || "N/A"}</span>
            )}
          </div>
          <div>
            <strong>Bio:</strong>
            {isEditing ? (
              <textarea
                name="bio"
                value={details?.bio || ""}
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded"
              />
            ) : (
              <span className="ml-2">{details?.bio || "N/A"}</span>
            )}
          </div>
          <div>
            <strong>Skills:</strong>
            {isEditing ? (
              <input
                type="text"
                name="skills_tag"
                value={details?.skills_tag || ""}
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded"
              />
            ) : (
              <span className="ml-2">{details?.skills_tag || "N/A"}</span>
            )}
          </div>
          <div>
            <strong>Resume:</strong>
            {details?.resume_link_to_file ? (
              <a
                href={details.resume_link_to_file}
                className="text-blue-600 underline ml-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            ) : (
              <button
                onClick={() => setShowResumeModal(true)}
                className="ml-2 text-blue-600 underline"
              >
                Add Resume
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md space-y-4">
            <h3 className="text-xl font-semibold">Upload New Profile Image</h3>
            <div
              className="drag-box"
              onDrop={(e) => {
                e.preventDefault();
                setProfileImage(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <p>Drag & drop your image here, or click to select</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="modal-overlay">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md space-y-4">
            <h3 className="text-xl font-semibold">Upload Resume</h3>
            <div
              className="drag-box"
              onDrop={(e) => {
                e.preventDefault();
                setResumeFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <p>Drag & drop your PDF here, or click to select</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResumeModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleResumeUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
