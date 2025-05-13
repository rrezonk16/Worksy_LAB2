import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import gsap from "gsap";
import { FaLinkedinIn, FaFacebookF, FaTwitter } from "react-icons/fa";

const JobListingsById = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const loadingRef = useRef();
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/public/jobs/${id}`
        );
        setJob(response.data.job);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
  return {
    question_id: questionId,
    answer: answer instanceof File ? answer : answer, 
  };
});

    setIsSubmitting(true);
    gsap.to(loadingRef.current, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out",
    });

try {
  const formData = new FormData();
  formData.append("job_id", id);

  formattedAnswers.forEach((answer, index) => {
    formData.append(`answers[${index}][question_id]`, answer.question_id);

    if (answer.answer instanceof File) {
      formData.append(`answers[${index}][answer]`, answer.answer);
    } else {
      formData.append(`answers[${index}][answer]`, answer.answer);
    }
  });

  const response = await axios.post(
    `http://127.0.0.1:8000/api/job-apply`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to apply for the job");
  }

  navigate("/my-applications");
} catch (error) {
  console.error("Failed to apply:", error);
  alert(
    error.response?.data?.message || "Something went wrong. Please try again."
  );
  navigate("/my-applications");
} finally {
  gsap.to(loadingRef.current, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "power2.out",
  });
  setIsSubmitting(false);
}

  };

  if (!job) {
    return (
      <div className="text-center mt-20 text-lg">Loading job details...</div>
    );
  }

  const { details, company } = job;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div
        ref={loadingRef}
        className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M12 4v4a4 4 0 014 4h4a8 8 0 00-8-8z"
            />
          </svg>
          <p className="text-lg font-medium text-indigo-700">
            Submitting your application...
          </p>
        </div>
      </div>

      <main className="flex-grow">
        <section className="w-full px-4 py-12 lg:px-0 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <img
              src={`http://127.0.0.1:8000${company.logo_url}`}
              alt={company.name}
              className="w-28 h-28 object-contain rounded shadow-md"
            />

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-indigo-700 mb-2">
                {job.title}
              </h1>
              <p className="text-gray-700 text-lg mb-6">{job.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-gray-600 text-sm mb-6">
                <p>
                  <strong>Company:</strong> {company?.name}
                </p>
                <p>
                  <strong>Location:</strong> {details?.location}
                </p>
                <p>
                  <strong>Wage:</strong> {details?.wage}€
                </p>
                <p>
                  <strong>Employment Type:</strong> {details?.employment_type}
                </p>
                <p>
                  <strong>Experience Level:</strong> {details?.experience_level}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(details?.deadline).toLocaleDateString()}
                </p>
                <p>
                  <strong>Contact Email:</strong> {company?.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {company?.phone_number}
                </p>
              </div>

              {details?.benefits?.length > 0 && (
                <div className="mb-6">
                  <strong className="block text-gray-800 mb-2">
                    Benefits:
                  </strong>
                  <ul className="flex flex-wrap gap-2">
                    {details.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {details?.hashtags?.length > 0 && (
                <div className="mb-8">
                  <strong className="block text-gray-800 mb-2">
                    Hashtags:
                  </strong>
                  <ul className="flex flex-wrap gap-2">
                    {details.hashtags.map((tag, idx) => (
                      <li key={idx}>
                        <Link
                          to={`/jobs/hashtag/${tag}`}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm transition"
                        >
                          #{tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Share this job
            </h3>
            <div className="flex gap-4">
              <a
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                  `https://88c5-84-22-48-194.ngrok-free.app/share/job/${id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FaLinkedinIn size={20} /> Share on LinkedIn
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://88c5-84-22-48-194.ngrok-free.app/share/job/${id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FaFacebookF size={20} /> Share on Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `https://88c5-84-22-48-194.ngrok-free.app/share/job/${id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <FaTwitter size={20} /> Share on Twitter
              </a>
            </div>
          </div>
          <div className="mt-14">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Application Questions
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {job.questions.map((q, index) => (
                <div
                  key={index}
                  className="p-4 border rounded bg-white shadow-sm"
                >
                  <label className="block font-medium text-gray-700 mb-3">
                    {q.question_text}
                  </label>

                  {q.input_type === "yesno" ? (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question_${q.id}`}
                          value="Yes"
                          required={q.is_required}
                          onChange={() => handleChange(q.id, "Yes")}
                          className="form-radio text-indigo-600"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question_${q.id}`}
                          value="No"
                          required={q.is_required}
                          onChange={() => handleChange(q.id, "No")}
                          className="form-radio text-indigo-600"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  ) : q.input_type === "select" ? (
                    <select
                      className="w-full border rounded px-3 py-2"
                      required={q.is_required}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {q.options.map((opt, idx) => (
                        <option key={idx} value={opt.option_text}>
                          {opt.option_text}
                        </option>
                      ))}
                    </select>
                  ) : q.input_type === "file" ? (
                    <input
                      type="file"
                      required={q.is_required}
                      onChange={(e) => handleChange(q.id, e.target.files[0])}
                      className="w-full border rounded px-3 py-2"
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      required={q.is_required}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      placeholder="Your answer"
                    />
                  )}
                </div>
              ))}

              <div className="text-right">
                <button
                  type="submit"
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
                  disabled={isSubmitting}
                >
                  Apply Now
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JobListingsById;
