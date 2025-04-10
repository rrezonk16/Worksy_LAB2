import React, { useState } from 'react';
import axios from 'axios';

const CreateJobApplication = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    questions: [
      {
        question_text: '',
        input_type: 'yesno', // Default to yesno
        is_required: true,
        options: [],
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const newQuestions = [...jobData.questions];
    newQuestions[index][name] = value;
    setJobData({ ...jobData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/jobs', jobData);
      alert('Job created successfully!');
    } catch (error) {
      console.error('Error creating job', error);
    }
  };

  return (
    <div>
      <h1>Create Job</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Job Description</label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <h3>Questions</h3>
        {jobData.questions.map((question, index) => (
          <div key={index}>
            <label>Question {index + 1}</label>
            <input
              type="text"
              name="question_text"
              value={question.question_text}
              onChange={(e) => handleQuestionChange(index, e)}
              placeholder="Enter question"
              required
            />
            <select
              name="input_type"
              value={question.input_type}
              onChange={(e) => handleQuestionChange(index, e)}
            >
              <option value="yesno">Yes/No</option>
              <option value="text">Text</option>
              <option value="select">Select</option>
            </select>
            {question.input_type === 'select' && (
              <div>
                <label>Options (comma-separated)</label>
                <input
                  type="text"
                  name="options"
                  value={question.options.join(', ')}
                  onChange={(e) =>
                    handleQuestionChange(index, {
                      target: {
                        name: 'options',
                        value: e.target.value.split(',').map((opt) => opt.trim()),
                      },
                    })
                  }
                />
              </div>
            )}
            <div>
              <label>
                <input
                  type="checkbox"
                  name="is_required"
                  checked={question.is_required}
                  onChange={(e) =>
                    handleQuestionChange(index, {
                      target: {
                        name: 'is_required',
                        value: e.target.checked,
                      },
                    })
                  }
                />
                Required
              </label>
            </div>
          </div>
        ))}
        <button type="submit">Create Job</button>
      </form>
    </div>
  );
};

export default CreateJobApplication;
