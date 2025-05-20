import React, { useState } from "react";
import axios from "axios";

const SendInterviewInviteModal = ({ applicationId, onClose, onSuccess }) => {
  const [date, setDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!date || !start_time || !end_time) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("company_user_token");

      await axios.post(
        "http://localhost:8000/api/schedule-interview",
        {
          application_id: applicationId,
          date,
          start_time,
          end_time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Interview scheduled and email sent!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to send interview invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-[400px] space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-center">Schedule Interview</h2>

        <div className="space-y-2">
          <div>
            <label className="block mb-1 text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Start Time</label>
            <input
              type="time"
              value={start_time}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">End Time</label>
            <input
              type="time"
              value={end_time}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendInterviewInviteModal;
