import React, { useState } from 'react';
import axios from 'axios';

const UploadCompanyLogo = () => {
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!logo || logo.type !== 'image/png') {
      setMessage('Please upload a PNG image.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', logo);

    try {
      const token = localStorage.getItem('company_user_token');
      const response = await axios.post('http://localhost:8000/api/company/logo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Logo uploaded successfully!');
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Company Logo</h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Please upload a <span className="font-semibold">PNG</span> image with recommended dimensions of <span className="font-semibold">300x300</span> pixels.
      </p>
      <input
        type="file"
        accept="image/png"
        onChange={handleFileChange}
        className="w-full mb-4 border p-2 rounded"
      />
      <button
        onClick={handleUpload}
        className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Upload Logo
      </button>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default UploadCompanyLogo;
