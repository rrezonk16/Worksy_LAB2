import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns"; // Import date-fns for formatting dates
import EditJobModal from "./EditJobModal";
import MakeCV from "./MakeCV";

const JobExperiences = ({ userId }) => {
  const [pastJobs, setPastJobs] = useState([]);
  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    start_date: "",
    end_date: "",
    city: "",
    job_type: "Full-Time", // default
    description: "",
  });
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [jobData, setJobData] = useState({
    company_name: "",
    job_title: "",
    start_date: "",
    end_date: "",
    city: "",
    job_type: "Full-Time",
    description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    axios
      .get(`http://127.0.0.1:8000/api/past-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPastJobs(response.data.past_jobs);
      })
      .catch((err) => console.error("Error fetching past jobs:", err));
  }, [userId]);
  

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/past-jobs",
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPastJobs([...pastJobs, response.data.past_job]);
        setFormData({
          company_name: "",
          job_title: "",
          start_date: "",
          end_date: "",
          city: "",
          job_type: "Full-Time",
          description: "",
        });
        setShowForm(false); // Hide the form after successful submission
      })
      .catch((err) => console.error("Error creating past job:", err));
  };

  const handleUpdate = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/past-jobs/${jobData.id}`,
        { ...jobData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        const updatedJobs = pastJobs.map((job) =>
          job.id === jobData.id ? response.data.past_job : job
        );
        setPastJobs(updatedJobs);
        setShowModal(false); // Close modal after update
        setJobData({
          company_name: "",
          job_title: "",
          start_date: "",
          end_date: "",
          city: "",
          job_type: "full_time",
          description: "",
        });
      })
      .catch((err) => console.error("Error updating past job:", err));
  };

  const handleEdit = (job) => {
    setJobData(job);
    setShowModal(true); // Open modal for editing
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/past-jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        const filteredJobs = pastJobs.filter((job) => job.id !== id);
        setPastJobs(filteredJobs);
      })
      .catch((err) => console.error("Error deleting past job:", err));
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 flex flex-row text-center text-white px-6 py-2 rounded-xl mb-4 cursor-pointer hover:bg-blue-700 transition-all w-full h-20 justify-between items-center"
      >
        <span className="flex-grow">{showForm ? "Cancel" : "Add Experience"}</span>
      </button>
      {showForm && (
        <div className="bg-white p-6 shadow-md rounded-xl space-y-4">
          <h3 className="text-xl font-semibold mb-4">
            {editingJob ? "Edit" : "Add"} Job Experience
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editingJob ? handleUpdate() : handleCreate();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Position</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Job Type</label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              >
                <option value="Full-Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Part-Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-full mt-4 hover:bg-green-700"
            >
              {editingJob ? "Update" : "Create"} Job
            </button>
          </form>
        </div>
      )}

      {/* Display Past Jobs */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Past Job Experiences</h3>
        <ul className="space-y-4">
          {pastJobs.length > 0 ? (
            pastJobs.map((job) => (
              <li
                key={job.id}
                className="bg-white p-6 shadow-md rounded-xl flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-semibold">{job.company_name}</h4>
                  <p className="text-sm">
                    {job.job_title} ({job.job_type})
                  </p>
                  <p className="text-sm">{job.city}</p>
                  <p className="text-sm">
                    {format(new Date(job.start_date), "MM/dd/yyyy")} to{" "}
                    {job.end_date
                      ? format(new Date(job.end_date), "MM/dd/yyyy")
                      : "Present"}
                  </p>
                  <p className="text-sm">{job.description}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(job)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No past job experiences available.</p>
          )}
        </ul>
      </div>

      {/* Modal for editing job experience */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-xl rounded-xl max-w-xl w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Job Experience</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              {/* Repeat the same form fields as before */}
              {/* ... */}
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-full mt-4 hover:bg-green-700"
              >
                Update Job
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="text-red-600 hover:text-red-800 mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <EditJobModal
        showModal={showModal}
        setShowModal={setShowModal}
        jobData={jobData}
        setJobData={setJobData}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default JobExperiences;
