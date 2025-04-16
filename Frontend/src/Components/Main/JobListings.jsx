import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/public/jobs"
        );
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-10">Explore Jobs</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/job-listings/${job.id}`)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200"
              >
                <div className="flex mb-4 flex-col">
                  <img
                    src={
                      job.company?.logo_url || "http://localhost:5173/src/assets/logo_icon.png"
                    }
                    alt="Company Logo"
                    className="h-16 w-16 object-cover rounded-full"
                  />
                  {job.company?.name}
                </div>

                <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">
                  {job.title}
                </h2>

                <p className="text-gray-600 text-sm mb-3 text-center">
                  {job.description.length > 100
                    ? job.description.slice(0, 100) + "..."
                    : job.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default JobListings;
