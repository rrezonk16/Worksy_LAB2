import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const EditJobForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get("active-tab");
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();


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

  let jobId = null;
  if (activeTab && activeTab.startsWith("edit-job=")) {
    jobId = activeTab.split("=")[1];
  }
  const [job, setJob] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    attachment: null,
    wage: "",
    location: "",
    employment_type: "",
    experience_level: "",
    hashtags: [],
    benefits: [],
    deadline: "",
    questions: [],
    newQuestions: [],
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("company_user_token");

  useEffect(() => {
    const token = localStorage.getItem("company_user_token");

    axios
      .get(`http://localhost:8000/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const jobData = res.data.job;
        const rawDeadline = jobData.details?.deadline || "";
        const formattedDeadline = rawDeadline ? rawDeadline.split("T")[0] : "";
        setJob(jobData);
        setForm({
          title: jobData.title || "",
          description: jobData.description || "",
          wage: jobData.details?.wage || "",
          location: jobData.details?.location || "",
          employment_type: jobData.details?.employment_type || "",
          experience_level: jobData.details?.experience_level || "",
          hashtags: jobData.details?.hashtags || [],
          benefits: jobData.details?.benefits || [],
          deadline: formattedDeadline,
          questions: jobData.questions || [],
          newQuestions: [],
          attachment: null,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch job:", err);
      });
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()),
    }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleNewQuestionChange = (index, field, value) => {
    const updated = [...form.newQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, newQuestions: updated }));
  };

  const addNewQuestion = () => {
    setForm((prev) => ({
      ...prev,
      newQuestions: [
        ...prev.newQuestions,
        {
          question_text: "",
          input_type: "text",
          is_required: false,
          options: [],
        },
      ],
    }));
  };

  const removeQuestion = (index, fromNew = false) => {
    if (fromNew) {
      const updated = [...form.newQuestions];
      updated.splice(index, 1);
      setForm((prev) => ({ ...prev, newQuestions: updated }));
    } else {
      const updated = [...form.questions];
      updated.splice(index, 1);
      setForm((prev) => ({ ...prev, questions: updated }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      questions: JSON.stringify([...form.questions, ...form.newQuestions]),
      wage: form.wage,
      location: form.location,
      employment_type: form.employment_type,
      experience_level: form.experience_level,
      hashtags: form.hashtags,
      benefits: form.benefits,
      deadline: form.deadline,
    };

    try {
      const res = await axios.put(
        `http://localhost:8000/api/jobs/${jobId}/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        alert("Job updated successfully!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to update job:", err);
      alert("Failed to update job.");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div>Loading job...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-18">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attachment
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wage
            </label>
            <input
              type="text"
              name="wage"
              value={form.wage}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employment Type
            </label>
            <input
              type="text"
              name="employment_type"
              value={form.employment_type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <input
              type="text"
              name="experience_level"
              value={form.experience_level}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hashtags (comma separated)
            </label>
            <input
              type="text"
              value={form.hashtags.join(", ")}
              onChange={(e) => handleArrayChange("hashtags", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Benefits (comma separated)
            </label>
            <input
              type="text"
              value={form.benefits.join(", ")}
              onChange={(e) => handleArrayChange("benefits", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm input"
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Current Questions
          </h3>
          <div className="space-y-3">
            {form.questions.map((q, i) => (
              <div
                key={q.id}
                className="bg-gray-100 p-4 rounded shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">{q.question_text}</p>
                  <p className="text-sm text-gray-600 italic">
                    {q.input_type} {q.is_required && "(required)"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                className="text-red-600 text-sm hover:bg-red-500 hover:text-white cursor-pointer border border-red-600 px-2 py-1 rounded mt-5"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {form.newQuestions.map((q, i) => (
            <div
              key={i}
              className="border p-4 rounded-md bg-gray-50 mb-4 space-y-2"
            >
              <input
                type="text"
                placeholder="Question text"
                value={q.question_text}
                onChange={(e) =>
                  handleNewQuestionChange(i, "question_text", e.target.value)
                }
                className="input w-full"
              />

              <select
                value={q.input_type}
                onChange={(e) =>
                  handleNewQuestionChange(i, "input_type", e.target.value)
                }
                className="input w-full"
              >
                <option value="text">Text</option>
                <option value="yesno">Yes/No</option>
                <option value="file">File</option>
                <option value="select">Select</option>
              </select>

              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={q.is_required}
                  onChange={(e) =>
                    handleNewQuestionChange(i, "is_required", e.target.checked)
                  }
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>

              {q.input_type === "select" && (
                <input
                  type="text"
                  placeholder="Option1, Option2"
                  onChange={(e) =>
                    handleNewQuestionChange(
                      i,
                      "options",
                      e.target.value.split(",").map((o) => o.trim())
                    )
                  }
                  className="input w-full"
                />
              )}
              <br />
              <button
                type="button"
                onClick={() => removeQuestion(i, true)}
                className="text-red-600 text-sm hover:bg-red-500 hover:text-white cursor-pointer border border-red-600 px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}

 <button
        onClick={addNewQuestion}
        className={`px-6 mt-3 py-3 rounded-lg shadow transition-all ${
          subscription === null
            ? 'hidden'
            : 'bg-green-600 text-white hover:bg-green-700  cursor-pointer hover:shadow-yellow-500'
        }`}
      >
        Add Custom Question
      </button>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="btn bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobForm;
