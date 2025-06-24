import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Navigation/Navbar";
import Footer from "../../Navigation/Footer";
import axios from "axios";

const ContriesJobs = () => {
  const { countryname } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const countryCodeMap = {
    germany: "de",
    france: "fr",
    spain: "es",
    kosovo: "xk",
    albania: "al",
    usa: "us",
    "bosnia-and-herz.": "ba",
    bulgaria: "bg",
    croatia: "hr",
    greece: "gr",
    montenegro: "me",
    "north macedonia": "mk",
    romania: "ro",
    serbia: "rs",
    slovenia: "si",
    turkey: "tr",
  };

  const getCountryCode = (name) => {
    return countryCodeMap[name.toLowerCase()] || "us"; // fallback
  };

  useEffect(() => {
    if (!countryname) return;

    setLoading(true);
    axios
      .get(
        `http://127.0.0.1:8000/api/public/jobs/country/${countryname}?page=${currentPage}`
      )
      .then((res) => {
        setJobs(res.data.data);
        setLastPage(res.data.last_page || 1);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, [countryname, currentPage]);

  return (
    <div>
      <Navbar />
      <div className="flex-grow ">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-row">
            <div
              className="relative h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover w-1/3"
              style={{
                backgroundImage: `
      linear-gradient(to left, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4), rgba(255,255,255,0)),
      url(https://flagcdn.com/${getCountryCode(countryname)}.svg)
    `,
              }}
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-md">
                  Jobs in{" "}
                  {countryname.charAt(0).toUpperCase() + countryname.slice(1)}
                </h1>
                <p className="text-gray-700 drop-shadow-sm">
                  Browse through the latest job listings in{" "}
                  {countryname.charAt(0).toUpperCase() + countryname.slice(1)}.
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-4 mx-4">
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
                      className="w-14 object-cover"
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
                  {job.company?.subscriptions?.length > 0 && (
                    <div className="flex justify-center mb-2">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <span>PREMIUM</span>
                        <span>⭐</span>
                      </span>
                    </div>
                  )}

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
          </div>
        )}
      </div>
      <div className="flex justify-center my-8 gap-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {lastPage}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, lastPage))}
          disabled={currentPage === lastPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ContriesJobs;
