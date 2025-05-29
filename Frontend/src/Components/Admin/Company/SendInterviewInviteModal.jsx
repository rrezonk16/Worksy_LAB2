import React, { useState } from "react";
import axios from "axios";

const SendInterviewInviteModal = ({ applicationId, onClose, onSuccess }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!date || !time) {
      alert("Please select both date and time");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("company_user_token");

      const scheduled_at = new Date(`${date}T${time}:00`).toISOString();

      await axios.post(
        "http://127.0.0.1:8000/api/interview-meetings",
        {
          job_application_id: applicationId,
          scheduled_at,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Interview meeting created successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create interview meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] space-y-5 shadow-2xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Schedule Interview
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-700 font-medium">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Create Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendInterviewInviteModal;
