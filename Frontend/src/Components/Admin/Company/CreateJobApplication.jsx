import { useEffect, useState } from "react";
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
  const [wage, setWage] = useState("");
  const [location, setLocation] = useState("On-Site");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experienceLevel, setExperienceLevel] = useState("Entry-level");
  const [benefits, setBenefits] = useState("");
  const [deadline, setDeadline] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [input, setInput] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [countryId, setCountryId] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
const [city_id, setCityId] = useState(''); 

  const addHashtag = () => {
    const trimmed = input.trim();
    if (trimmed && !hashtags.includes(trimmed)) {
      setHashtags([...hashtags, trimmed]);
      setInput("");
    }
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const premadeQuestions = [
    { question_text: "What is your first name?", input_type: "text" },
    { question_text: "What is your surname?", input_type: "text" },
    { question_text: "What is your email address?", input_type: "text" },
    { question_text: "What is your phone number?", input_type: "text" },
    {
      question_text: "Do you have experience in this field?",
      input_type: "yesno",
    },
    {
      question_text: "Upload your CV",
      input_type: "file",
    },
  ];
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (subscription === null) {
      const userConfirmed = window.confirm(
        "You need to subscribe to use this feature. Do you want to subscribe?"
      );
      if (userConfirmed) {
        navigate("/subscribe");
      }
    } else {
      setShowQuestionForm(true);
    }
  };
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
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("questions", JSON.stringify(questions));
    formData.append("wage", wage || "");
    formData.append("location", location || "");
    formData.append("employment_type", employmentType || "");
    formData.append("experience_level", experienceLevel || "");
    formData.append("deadline", deadline || "");
    formData.append("country_id", countryId || "1");
    formData.append("city_id", city_id || "11");

    if (Array.isArray(hashtags)) {
      hashtags.forEach((tag, index) => {
        formData.append(`hashtags[${index}]`, tag);
      });
    }

    if (benefits) {
      benefits
        .split(",")
        .map((b) => b.trim())
        .forEach((b, index) => {
          formData.append(`benefits[${index}]`, b);
        });
    }

    try {
      const token = localStorage.getItem("company_user_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/jobs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);
      alert("Job created successfully!");
      navigate("/company/dashboard?active-tab=jobs-list");
    } catch (error) {
      console.error(
        "Error creating job:",
        error.response?.data || error.message
      );
      alert("Failed to create job. Check console for details.");
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
  useEffect(() => {
    const token = localStorage.getItem("company_user_token");

    if (!token) {
      navigate("/company/panel/login");
      return;
    }
    axios
      .get("http://localhost:8000/api/subscription", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 404) {
          setSubscription(null);
        } else {
          setSubscription(response.data.subscription);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setSubscription(null);
        }
      });
  }, [navigate]);

   useEffect(() => {
    axios.get('http://localhost:8000/api/countries')
      .then(res => setCountries(res.data))
      .catch(err => console.error('Failed to fetch countries', err));
  }, []);

  const handleCountryChange = (e) => {
    const selectedId = e.target.value;
    setCountryId(selectedId);

    if (selectedId) {
      axios.get(`http://localhost:8000/api/countries/${selectedId}/cities`)
        .then(res => setCities(res.data))
        .catch(err => console.error('Failed to fetch cities', err));
    } else {
      setCities([]);
    }
  };

  return (
    <div className="flex flex-row justify-between gap-7">
      <div className="w-1/2 mt-10">
        <h1 className="text-3xl font-semibold text-center my-5 ">
          Create Job Application
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              placeholder="Enter job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              placeholder="Write a brief description of the job role"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wage
            </label>
            <input
              type="text"
              placeholder="e.g. $1500/month"
              value={wage}
              onChange={(e) => setWage(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
         <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Country
      </label>
      <select
        value={countryId}
        onChange={handleCountryChange}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      >
        <option value="">Select country</option>
        {countries.map(country => (
          <option key={country.id} value={country.id}>{country.name}</option>
        ))}
      </select>

      {cities.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cities
          </label>
          
          <select 
            value={city_id}
            onChange={(e) => setCityId(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
            <option value="">Select city</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select location</option>
              <option value="On-Site">On-Site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select job type</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior-level">Senior-level</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hashtags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter hashtag"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={addHashtag}
                className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600 transition"
              >
                +
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button
                    onClick={() => removeHashtag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <input
              type="text"
              placeholder="Benefits (comma separated)"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl shadow-sm block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
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
              <option value="file">File Upload</option>
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
      </div>
      <div className="space-y-4 mt-10 w-1/2 ">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Premade Questions:</h2>
          <div className="flex flex-col gap-4">
            {premadeQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAddPremadeQuestion(q)}
                className="bg-purple-600 cursor-pointer text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition-all"
              >
                Add: {q.question_text}
              </button>
            ))}
          </div>
        </div>
        <div>
          <button
            onClick={handleButtonClick}
            className={`px-6 mt-3 py-3 rounded-lg shadow transition-all ${
              subscription === null
                ? "bg-gray-500 text-gray-300 cursor-not-allowed hover:shadow-yellow-500"
                : "bg-green-600 text-white hover:bg-green-700 hover:shadow-yellow-500"
            }`}
          >
            Add Custom Question
          </button>
        </div>

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
