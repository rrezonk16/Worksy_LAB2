import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import JobFilterSidebar from "./JobFilterSidebar";
import { IoFilter } from "react-icons/io5"; 

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employmentType, setEmploymentType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState("");
  const [deadline, setDeadline] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [wageRange, setWageRange] = useState(5000);
  const [cities, setCities] = useState([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/public/jobs",
        {
          params: {
            name: searchTerm,
            city: selectedCity,
            max_wage: wageRange,
            tag: selectedTag,
            employment_type: employmentType,
            experience_level: experienceLevel,
            benefits: selectedBenefits
              ? selectedBenefits.split(",").map((b) => b.trim())
              : undefined,
            hashtags: selectedHashtags
              ? selectedHashtags.split(",").map((h) => h.trim())
              : undefined,
            deadline,
          },
        }
      );

      setJobs(response.data.data || response.data.jobs);

      const uniqueCities = [
        ...new Set(
          response.data.data?.map((j) => j.details?.location).filter(Boolean)
        ),
      ];
      setCities(uniqueCities);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCity, wageRange]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
  
    {/* Mobile Filter Button */}
    <div className="lg:hidden px-4 py-2">
      <button
        onClick={() => setShowMobileSidebar(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md"
      >
        <IoFilter size={20} />
        Filter
      </button>
    </div>
  
    <div className="flex flex-col lg:flex-row gap-8 pb-8 relative">
      {/* Sidebar (shown on large screens or mobile toggle) */}
      <div
        className={`${
          showMobileSidebar
            ? "absolute top-0 left-0 w-3/4 h-full bg-white z-20 p-4 shadow-lg"
            : "hidden"
        } lg:block lg:static lg:w-1/4`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end mb-2">
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        <JobFilterSidebar
          {...{
            searchTerm,
            setSearchTerm,
            selectedCity,
            setSelectedCity,
            cities,
            wageRange,
            setWageRange,
            employmentType,
            setEmploymentType,
            experienceLevel,
            setExperienceLevel,
            selectedTag,
            setSelectedTag,
            selectedBenefits,
            setSelectedBenefits,
            selectedHashtags,
            setSelectedHashtags,
            deadline,
            setDeadline,
          }}
        />
      </div>
  
      {/* Job listings */}
      <div className="flex-grow lg:w-3/4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-10">
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {job.company?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {job.details?.location}
                    </p>
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
                      <span className="font-medium">Wage:</span> €
                      {job.details.wage}
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
        )}
      </div>
    </div>
  
    <Footer />
  </div>
  );
};

export default JobListings;
