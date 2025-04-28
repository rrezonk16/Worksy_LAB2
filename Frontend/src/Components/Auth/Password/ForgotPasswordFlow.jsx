import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import logo_full from "../../../assets/logo_full.png";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [step]);

  const showMessage = (text, error = false) => {
    setMessage(text);
    setIsError(error);
  };

  const handleSendCode = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/forgot-password", { email });
      showMessage("Code sent to your email");
      setStep(2);
    } catch (err) {
      showMessage(err.response.data.message, true);   

    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/verify-code", {
        email,
        code,
      });
      showMessage("Code verified.");
      setStep(3);
    } catch (err) {
      showMessage(err.response.data.message, true);   

    } finally {
      setLoading(false);
    }
  };
  const messageRef = useRef(null);

  useEffect(() => {
    if (message) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [message]);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/reset-password", {
        email,
        code,
        password,
        password_confirmation: passwordConfirmation,
      });
      showMessage("Password changed successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      showMessage("Failed to reset password.", true);
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <img src={logo_full} alt="Logo" className="w-40 mb-6" />
      <div
        ref={containerRef}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-5 transition-all"
      >
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        {message && (
          <p
            ref={messageRef}
            className={`text-center transition-opacity duration-500 ${
              isError ? "text-red-600 font-bold" : "text-blue-600"
            }`}
          >
            {message}
          </p>
        )}
        {step === 1 && (
          <>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block font-medium">Verification Code</label>
            <input
              type="text"
              placeholder="Enter the code sent to your email"
              className="w-full border p-2 rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={handleVerifyCode}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              {loading ? "Verifying..." : "Next"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block font-medium">New Password</label>
            <input
              type="password"
              placeholder="New password"
              className="w-full border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="block font-medium">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full border p-2 rounded"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;
