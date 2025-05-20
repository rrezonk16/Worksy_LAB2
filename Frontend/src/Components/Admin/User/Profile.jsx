import { useEffect, useState } from "react";
import Navbar from "../../Navigation/Navbar";
import Footer from "../../Navigation/Footer";
import axios from "axios";
import ProfileImageEditor from "./ProfileImageEditor";
import ProfileModal from "./ProfileModal";
import ResumeModal from "./ResumeModal";
import "./modal.css";
import JobExperiences from "./JobExperinces";
import { useNavigate } from "react-router-dom";
import IconLoading from "../../Loaders/IconLoading";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

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
    if (
      [
        "birthday",
        "gender",
        "bio",
        "skills_tag",
        "resume_link_to_file",
      ].includes(name)
    ) {
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
    const data = new FormData();
    data.append("name", formData.name || "");
    data.append("surname", formData.surname || "");
    data.append("email", formData.email || "");
    data.append("phone_number", formData.phone_number || "");
    data.append("birthday", formData.details?.birthday || "");
    data.append("gender", formData.details?.gender || "");
    data.append("bio", formData.details?.bio || "");
    data.append("skills_tag", formData.details?.skills_tag || "");
    data.append(
      "resume_link_to_file",
      formData.details?.resume_link_to_file || ""
    );
    data.append("social_links[]", formData.details?.social_links?.[0] || "");
    data.append("social_links[]", formData.details?.social_links?.[1] || "");

    if (profileImage) {
      data.append("profile_image", profileImage);
    }

    axios
      .post("http://127.0.0.1:8000/api/user/update-profile", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Profile updated successfully");
        setShowProfileModal(false);
        setIsEditing(false);
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  const handleProfileUpload = () => {
    handleUpdate();
  };

  const handleResumeUpload = () => {
    const data = new FormData();
    data.append("cv", resumeFile);

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

  if (!user)
    return (
      <div className="p-6">
        <IconLoading />
      </div>
    );

  const { name, surname, email, phone_number, created_at, details } = formData;
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

        <div className="flex justify-end mb-4 gap-4">
          <button
            onClick={navigate.bind(null, "/cv-maker")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Generate your CV
          </button>
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
          <ProfileImageEditor
            imageUrl={
              user.details?.profile_image ||
              "https://i.pinimg.com/474x/07/c4/72/07c4720d19a9e9edad9d0e939eca304a.jpg"
            }
            onEditClick={() => setShowProfileModal(true)}
          />

          {showProfileModal && (
            <ProfileModal
              onClose={() => setShowProfileModal(false)}
              onUpload={handleProfileUpload}
              setFile={setProfileImage}
            />
          )}

          {showResumeModal && (
            <ResumeModal
              onClose={() => setShowResumeModal(false)}
              onUpload={handleResumeUpload}
              setFile={setResumeFile}
            />
          )}

          <div className="flex-1 space-y-4 w-full">
            <div>
              <strong>Name:</strong>
              {isEditing ? (
                <>
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
                </>
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
                Profile Created: {new Date(created_at).toLocaleDateString()}
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
                href={`http://localhost:8000${details.resume_link_to_file}`}
                className="text-blue-600 underline ml-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            ) : (
              <button
                onClick={() => setShowResumeModal(true)}
                className="ml-2 cursor-pointer text-blue-600 underline"
              >
                Add Resume
              </button>
            )}
          </div>
        </div>
      </div>
      <JobExperiences />
      <Footer />
    </>
  );
};

export default Profile;
