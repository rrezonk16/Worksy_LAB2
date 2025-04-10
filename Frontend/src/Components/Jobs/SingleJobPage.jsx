import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SingleJobPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/jobs`, {
          headers: {
            Authorization: `Bearer 52|FKgPBWkSw33qtehhsuZJ2oinrKzO88XNBvG8pX3a8d4225e0`,
          },
        });
        console.log(response);
        
        setJob(response.data.jobs[0]);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="mb-6">{job.description}</p>

      <form className="space-y-4">
        {job.questions.map((q) => (
          <div key={q.id}>
            <label className="block mb-1 font-medium">
              {q.question_text} {q.is_required && '*'}
            </label>

            {q.input_type === 'yesno' && (
              <div className="space-x-4">
                <label>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value="Yes"
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value="No"
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                  No
                </label>
              </div>
            )}

            {q.input_type === 'select' && (
              <select
                className="border rounded px-2 py-1"
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {q.options.map((opt) => (
                  <option key={opt.id} value={opt.option_text}>
                    {opt.option_text}
                  </option>
                ))}
              </select>
            )}

            {q.input_type === 'text' && (
              <input
                type="text"
                className="border rounded px-2 py-1 w-full"
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default SingleJobPage;
