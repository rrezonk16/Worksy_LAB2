import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../Navigation/Navbar';
import Footer from '../Navigation/Footer';

const JobListingsById = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/public/jobs/${id}`);
        setJob(response.data.job);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to apply.');
      return;
    }
  
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: questionId,
      answer,
    }));
  
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/job-apply`,
        {
          job_id: id,
          answers: formattedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error('Failed to apply for the job');
        
      }
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply:', error);
      alert(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };
  

  if (!job) {
    return <div className="text-center mt-20 text-lg">Loading job details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-gray-700 mb-4">{job.description}</p>
        <p className="text-sm text-gray-500 mb-8">Company: {job.company?.name}</p>

        <div>
          <h2 className="text-xl font-semibold mb-4">Job Questions</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {job.questions.map((q, index) => (
              <div key={index} className="border p-4 rounded bg-gray-50">
                <label className="block font-medium mb-3">{q.question_text}</label>

                {q.input_type === 'yesno' ? (
                  <div className="flex items-center gap-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question_${q.id}`}
                        value="Yes"
                        required={q.is_required}
                        onChange={() => handleChange(q.id, 'Yes')}
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
                        onChange={() => handleChange(q.id, 'No')}
                        className="form-radio text-indigo-600"
                      />
                      <span>No</span>
                    </label>
                  </div>
                ) : q.input_type === 'select' ? (
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
              >
                Apply Now
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobListingsById;
