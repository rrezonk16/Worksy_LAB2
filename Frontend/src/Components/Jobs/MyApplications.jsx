import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import "../Admin/User/modal.css";
import Talk from "talkjs";

import "../Admin/User/modal.css";
import "../Admin/User/modal.css";

const MyApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openJobs, setOpenJobs] = useState({});
  const navigate = useNavigate();

  const handleNavigate = (applicationId) => {
    navigate(`/my-applications/${applicationId}`);
  };

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Applications:", response.data);

        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  const toggleOpen = (jobId) => {
    setOpenJobs((prev) => {
      const newState = { ...prev };

      if (newState[jobId]) {
        gsap.to(`#answers-${jobId}`, { opacity: 0, height: 0, duration: 0.5 });
        delete newState[jobId];
      } else {
        gsap.to(`#answers-${jobId}`, {
          opacity: 1,
          height: "auto",
          duration: 0.5,
        });
        newState[jobId] = true;
      }

      return newState;
    });
  };

  useEffect(() => {
    const fetchUserAndInitTalk = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user;
        console.log("User Details:", user);

        const userDetails = user.details;
        console.log("User Details:", userDetails);
        const talkUser = {
          id: `applicant_${userDetails.user_id}`,
          name: `${user.name} ${user.surname}`,
          email: user.email,
          photoUrl:
            userDetails?.profile_image ||
            "https://talkjs.com/images/avatar-1.jpg",
          role: "applicant",
        };

        Talk.ready.then(() => {
          const me = new Talk.User(talkUser);

          const session = new Talk.Session({
            appId: "tEAW4NLM",
            me: me,
          });

          const inbox = session.createInbox();
          inbox.mount(document.getElementById("talkjs-container"));
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserAndInitTalk();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10">Loading your applications...</div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold mt-6 text-center">
        My Job Applications & Chat
      </h1>

      <div className="flex flex-row justify-between  ">
        <div
          id="talkjs-container"
          className="w-1/3 my-6 "
          style={{ height: "700px" }}
        ></div>

        <div className=" w-2/3 container px-4 py-8">
          {jobs.length === 0 ? (
            <p className="text-gray-600">
              You haven't applied to any jobs yet.
            </p>
          ) : (
            <div className="grid gap-6">
              {jobs.map((jobItem) => (
                <div
                  key={jobItem.job.id}
                  className="cursor-pointer p-5 border rounded-lg bg-white shadow hover:shadow-lg transition"
                >
                  <button
                    onClick={() => handleNavigate(jobItem.application_id)}
                    className="text-blue-600 cursor-pointer font-semibold hover:underline"
                  >
                    View Details
                  </button>

                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {jobItem.job.title}
                      </h2>
                      <p className="text-gray-700 mb-1">
                        {jobItem.job.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Company: {jobItem.job.company.name}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleOpen(jobItem.job.id)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {openJobs[jobItem.job.id]
                        ? "Hide Answers"
                        : "Show Answers"}
                    </button>
                  </div>
                  {jobItem.interview_meeting && (
                    <div className="mt-4">
                      {new Date(jobItem.interview_meeting.scheduled_at) <=
                      new Date() ? (
                        <a
                          href={`https://meet.jit.si/${jobItem.interview_meeting.room_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Join Meeting
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Interview scheduled for:{" "}
                          {new Date(
                            jobItem.interview_meeting.scheduled_at
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                  <div
                    id={`answers-${jobItem.job.id}`}
                    className="mt-4 space-y-4 overflow-hidden"
                    style={{ opacity: 0, height: 0 }} // Initially hidden
                  >
                    <div
                      key={jobItem.job.id}
                      className="bg-gray-100 p-4 rounded-md"
                    >
                      <p className="text-sm text-gray-600 mb-2">
                        Applied at: {jobItem.job.application_date}
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {jobItem.answers.map((answer, idx) => (
                          <li key={idx}>
                            <strong>
                              {answer.question_text ||
                                "No question text provided"}
                              :
                            </strong>{" "}
                            {typeof answer.answer === "string" &&
                            answer.answer.startsWith("applications/") ? (
                              <a
                                href={`http://localhost:8000/storage/${answer.answer}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 inline-block bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                              >
                                Open File
                              </a>
                            ) : (
                              answer.answer
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
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

export default MyApplications;
