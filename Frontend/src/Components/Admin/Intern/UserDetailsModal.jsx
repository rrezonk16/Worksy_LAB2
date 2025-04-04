// UserDetailsModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDetailsModal = ({ selectedUser, closeModal }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (selectedUser) {
        try {
          setIsLoading(true);
          setError(null); // Clear previous errors
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:8000/api/users/${selectedUser.id}/details`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserDetails(response.data); // Store the raw JSON response
        } catch (err) {
          console.error("Error fetching user details:", err);
          setError("Failed to load user details. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [selectedUser]);

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
    <div className="fixed inset-0 flex items-center  justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 ">
        {error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mt-4"
              onClick={() => setError(null)} // Clear error when user attempts to recover
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-2">
              <img
                src={userDetails.user.details.profile_image}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
              />
              <h2 className="text-2xl font-semibold text-center">{userDetails.user.name} {userDetails.user.surname}</h2>
              <p className="text-gray-600">{userDetails.user.role.name}</p>
            </div>

            <div className="mt-2">
              <h3 className="text-xl font-semibold mb-4">User Details</h3>
              <div className="space-y-4">
                <div className="flex-row flex justify-between border-b pb-1">
                  <span className="font-medium">Email:</span>
                  <span>{userDetails.user.email}</span>
                </div>
                <div className="flex-row flex justify-between border-b pb-1">
                  <span className="font-medium">Phone:</span>
                  <span>{userDetails.user.phone_number}</span>
                </div>
                <div className="flex-row flex justify-between border-b pb-1">
                  <span className="font-medium">Birthday:</span>
                  <span>{userDetails.user.details.birthday}</span>
                </div>
                <div className="flex-row flex justify-between border-b pb-1">
                  <span className="font-medium">Gender:</span>
                  <span>{userDetails.user.details.gender}</span>
                </div>
                <div className="flex-row flex justify-between border-b pb-1">
                  <span className="font-medium">Bio:</span>
                  <span>{userDetails.user.details.bio}</span>
                </div>
                <div className="flex-row flex justify-between border-b pb-1">
                  <span className="font-medium">Skills:</span>
                  <span>{userDetails.user.details.skills_tag}</span>
                </div>
                <div className="flex-row flex justify-between border-b pb-1">
                  <span className="font-medium">Resume:</span>
                  <a href={userDetails.user.details.resume_link_to_file} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </div>
                <div className="flex-row flex justify-between border-b pb-1">
                  <span className="font-medium">Social Links:</span>
                  <a href={userDetails.user.details.social_links} target="_blank" rel="noopener noreferrer">
                    {userDetails.user.details.social_links}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;
