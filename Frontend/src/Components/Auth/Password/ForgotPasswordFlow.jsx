import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const handleSendCode = async () => {
    try {
      await axios.post('http://localhost:8000/api/forgot-password', { email });
      setMessage('Code sent to your email');
      setStep(2);
    } catch (err) {
      setMessage('Failed to send reset code.');
    }
  };

  const handleVerifyCode = () => {
    setStep(3);
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:8000/api/reset-password', {
        email,
        code,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage('Password changed successfully!');
    } catch (err) {
      setMessage('Failed to reset password.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-md bg-white space-y-4">
      <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
      {message && <p className="text-center text-blue-500">{message}</p>}

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendCode} className="w-full bg-blue-600 text-white p-2 rounded">
            Send Code
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter the code sent to your email"
            className="w-full border p-2 rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleVerifyCode} className="w-full bg-blue-600 text-white p-2 rounded">
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full border p-2 rounded"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Change Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordFlow;
