import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PremiumSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/premium/jobs"
      );

      setJobs(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch premium jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading premium jobs...</p>
      </div>
    );
  }

  return (
    <div>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-10 mx-15">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => navigate(`/job-listings/${job.id}`)}
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                job.company?.logo_url
                  ? `http://localhost:8000${job.company.logo_url}`
                  : "http://localhost:5173/src/assets/logo_icon.png"
              }
              alt="Company Logo"
              className="h-14 object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2 justify-between w-full">
              <h3 className="text-lg font-semibold text-gray-800">
                {job.company?.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-500 text-sm font-semibold">
                  ⭐ Premium
                </span>
              </div></div>
              <p className="text-sm text-gray-500">{job.details?.location}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
            {job.title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 text-center">
            {job.description.length > 100
              ? job.description.slice(0, 100) + "..."
              : job.description}
          </p>

          {job.details && (
            <div className="text-sm text-gray-700 space-y-2 mb-4">
              <p>
                <span className="font-medium">Wage:</span> €{job.details.wage}
              </p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {job.details.employment_type}
              </p>
              <p>
                <span className="font-medium">Experience:</span>{" "}
                {job.details.experience_level}
              </p>
              <p>
                <span className="font-medium">Deadline:</span>{" "}
                {new Date(job.details.deadline).toLocaleDateString()}
              </p>
            </div>
          )}

          {job.details?.benefits?.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-sm mb-1 text-gray-700">
                Benefits:
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.details.benefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.details?.hashtags?.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-1 text-gray-700">
                Tags:
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.details.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      </div>
      <section className="bg-gray-100 py-16 px-8 lg:px-32 text-center">
        <h3 className="text-xl italic mb-6">Explore Thousands of <span className="text-green-600 font-bold">Jobs</span></h3>
       
        <button onClick={() => navigate('/job-listings')} className="bg-green-500 text-white px-6 py-2 rounded-full">Show More</button>
      </section>
    </div>
  );
};

export default PremiumSection;
