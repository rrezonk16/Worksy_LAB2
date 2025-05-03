import React, { useState } from 'react';
import axios from 'axios';

const LogsDownload = () => {
  const [userId, setUserId] = useState('');
  const [ip, setIp] = useState('');
  const [date, setDate] = useState('');

  const handleDownload = async () => {
    try {
      const params = {};
      if (userId) params.user_id = userId;
      if (ip) params.ip = ip;
      if (date) params.date = date;

      const token = localStorage.getItem('token'); // or however you're storing it

      const response = await axios.get('http://localhost:8000/api/download-logs', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // so we get a downloadable file
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'logs.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading logs:', error);
      alert('Failed to download logs. Check filters or try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Download API Logs</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="e.g. 123456"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">IP Address</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="e.g. 127.0.0.1"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Download Logs
        </button>
      </div>
    </div>
  );
};

export default LogsDownload;
