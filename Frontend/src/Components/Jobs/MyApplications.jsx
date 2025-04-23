import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navigation/Navbar';
import Footer from '../Navigation/Footer';
import { gsap } from 'gsap';

const MyApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openJobs, setOpenJobs] = useState({}); // Object to track individual job visibility

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/my-applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data.jobs);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
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
        // Close the job's answers
        gsap.to(`#answers-${jobId}`, { opacity: 0, height: 0, duration: 0.5 });
        delete newState[jobId]; // Remove the jobId from openJobs to close it
      } else {
        // Open the job's answers
        gsap.to(`#answers-${jobId}`, { opacity: 1, height: 'auto', duration: 0.5 });
        newState[jobId] = true; // Add the jobId to openJobs to open it
      }
  
      return newState; // Update state
    });
  };
  
  if (loading) return <div className="text-center mt-10">Loading your applications...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Job Applications</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-600">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="grid gap-6">
            {jobs.map((jobItem) => (
              <div
                key={jobItem.job.id}
                className="p-5 border rounded-lg bg-white shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{jobItem.job.title}</h2>
                    <p className="text-gray-700 mb-1">{jobItem.job.description}</p>
                    <p className="text-sm text-gray-500">Company: {jobItem.job.company.name}</p>
                  </div>
                  <button
                    onClick={() => toggleOpen(jobItem.job.id)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {openJobs[jobItem.job.id] ? 'Hide Answers' : 'Show Answers'}
                  </button>
                </div>

                <div
                  id={`answers-${jobItem.job.id}`}
                  className="mt-4 space-y-4 overflow-hidden"
                  style={{ opacity: 0, height: 0 }} // Initially hidden
                >
                  <div key={jobItem.job.id} className="bg-gray-100 p-4 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">
                      Applied at: {jobItem.job.application_date}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {jobItem.answers.map((answer, idx) => (
                        <li key={idx}>
                          <strong>{answer.question_text || 'No question text provided'}:</strong> {answer.answer}
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

      <Footer />
    </div>
  );
};

export default MyApplications;
