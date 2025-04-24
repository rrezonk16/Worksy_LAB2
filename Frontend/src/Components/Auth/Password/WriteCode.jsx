import React, { useState } from 'react';
import axios from 'axios';

const WriteCode = ({ email, onVerified }) => {
  const [code, setCode] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/verify-code', { email, code });
    onVerified(code);
  };

  return (
    <form onSubmit={handleVerify}>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" />
      <button type="submit">Verify</button>
    </form>
  );
};

export default WriteCode;
