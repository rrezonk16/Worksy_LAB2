import React, { useState } from 'react';
import axios from 'axios';

const ChangePasswordForm = ({ email, code }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/reset-password', {
      email,
      code,
      password,
      password_confirmation: confirm
    });
    alert("Password changed successfully");
  };

  return (
    <form onSubmit={handleReset}>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm Password" />
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePasswordForm;
