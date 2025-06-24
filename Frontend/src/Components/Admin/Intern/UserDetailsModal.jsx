import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDetailsModal = ({ selectedUser, closeModal }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (selectedUser) {
        try {
          setIsLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:8000/api/users/${selectedUser.id}/details`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = response.data.user;
          setUserDetails(response.data);
          setFormData({
            name: data.name || "",
            surname: data.surname || "",
            email: data.email || "",
            phone_number: data.phone_number || "",
            birthday: data.details?.birthday || "",
            gender: data.details?.gender || "",
            bio: data.details?.bio || "",
            skills_tag: data.details?.skills_tag || "",
            social_links: data.details?.social_links || "",
          });
        } catch (err) {
          console.error("Error fetching user details:", err);
          setError("Failed to load user details.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/users/${selectedUser.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeModal();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 flex justify-center items-center">
          <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full h-8 w-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[28rem] max-h-[90vh] overflow-y-auto">
        {error && (
          <div className="text-red-500 text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-center mb-4">Edit User</h2>

        <div className="space-y-4">
          {[
            { label: "Name", name: "name" },
            { label: "Surname", name: "surname" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone_number" },
            { label: "Birthday", name: "birthday", type: "date" },
            { label: "Gender", name: "gender" },
            { label: "Bio", name: "bio" },
            { label: "Skills", name: "skills_tag" },
            { label: "Social Links", name: "social_links" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name} className="flex flex-col">
              <label className="font-medium">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={closeModal}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
