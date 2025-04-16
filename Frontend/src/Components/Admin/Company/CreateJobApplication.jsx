import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateJobApplication = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [inputType, setInputType] = useState("yesno");
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState("");

  const premadeQuestions = [
    { question_text: "What is your first name?", input_type: "text" },
    { question_text: "What is your surname?", input_type: "text" },
    { question_text: "What is your email address?", input_type: "text" },
    { question_text: "What is your phone number?", input_type: "text" },
    {
      question_text: "Do you have experience in this field?",
      input_type: "yesno",
    },
  ];
  const navigate = useNavigate();
  const handleAddQuestion = () => {
    const newQuestion = {
      question_text: questionText,
      input_type: inputType,
      is_required: isRequired,
    };

    if (inputType === "select") {
      newQuestion.options = options.split(",").map((opt) => opt.trim());
    }

    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setInputType("yesno");
    setIsRequired(false);
    setOptions("");
    setShowQuestionForm(false);
  };

  const handleSubmit = async () => {
    const jobData = {
      title,
      description,
      questions: JSON.stringify(questions),
    };
    console.log("Job Data:", jobData);

    try {
      const token = localStorage.getItem("company_user_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/jobs",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Job created:", response.data);
      alert("Job created successfully!");
      navigate ("/company/dashboard?active-tab=jobs-list");
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleAddPremadeQuestion = (question) => {
    const newQuestion = {
      question_text: question.question_text,
      input_type: question.input_type,
      is_required: false,
    };

    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="flex flex-row mt-10 gap-4">
      <div className="max-w-3xl mt-10 ">
        <h1 className="text-3xl font-semibold text-center">
          Create Job Application
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-50  border-gray-300 border-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          />

          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-50  border-gray-300 border-2 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          />
        </div>

        <div>
          <button
            onClick={() => setShowQuestionForm(true)}
            className="bg-green-600 text-white px-6 mt-3 py-3 rounded-lg shadow hover:bg-green-700 transition-all"
          >
            Add Custom Question
          </button>
        </div>

        {showQuestionForm && (
          <div className="p-6 mt-6 bg-gray-100 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-4">Add Custom Question</h3>

            <input
              type="text"
              placeholder="Question Text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="yesno">Yes/No</option>
              <option value="select">Select</option>
              <option value="text">Text Input</option>
            </select>

            {inputType === "select" && (
              <input
                type="text"
                placeholder="Options (comma separated)"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                className="w-full p-3 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="form-checkbox"
              />
              <span>Required</span>
            </label>

            <button
              onClick={handleAddQuestion}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all"
            >
              Save Custom Question
            </button>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Premade Questions:</h2>
          <div className="flex flex-wrap gap-4">
            {premadeQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAddPremadeQuestion(q)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition-all"
              >
                Add: {q.question_text}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold">Questions Added:</h2>
        {questions.map((q, idx) => (
          <div key={idx} className="p-4 bg-gray-50 border rounded-lg shadow-sm">
            <p>
              <strong>{q.question_text}</strong> ({q.input_type}){" "}
              {q.is_required && "(Required)"}
            </p>
            {q.options && (
              <p className="text-sm text-gray-500">
                Options: {q.options.join(", ")}
              </p>
            )}
            <button
              onClick={() => handleRemoveQuestion(idx)}
              className="bg-red-600 text-white px-4 py-2 mt-2 rounded-lg shadow hover:bg-red-700 transition-all"
            >
              Remove
            </button>
          </div>
        ))}
        
        <button
          onClick={handleSubmit}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-800 transition-all"
        >
          Submit Job
        </button>
      </div>
    </div>
  );
};

export default CreateJobApplication;
