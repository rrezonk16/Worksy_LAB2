const EditJobModal = ({ showModal, setShowModal, jobData, setJobData, handleUpdate }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${
        showModal ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-6 shadow-xl rounded-lg max-w-md w-full h-screen overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Edit Job Experience</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={jobData.company_name}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Position</label>
            <input
              type="text"
              name="job_title"
              value={jobData.job_title}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={jobData.start_date}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              name="end_date"
              value={jobData.end_date}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={jobData.city}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Job Type</label>
            <select
              name="job_type"
              value={jobData.job_type}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white py-2 px-6 rounded-full hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;
