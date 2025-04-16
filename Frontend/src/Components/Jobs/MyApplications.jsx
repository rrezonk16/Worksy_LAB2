import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navigation/Navbar';
import Footer from '../Navigation/Footer';

const MyApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 border rounded-lg bg-white shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-700 mb-2">{job.description}</p>
                <p className="text-sm text-gray-500">Job ID: {job.id}</p>
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
