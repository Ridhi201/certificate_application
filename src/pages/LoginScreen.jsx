import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login({ setIsLoggedIn, setUserData }) {
  const navigate = useNavigate();

  const [internId, setInternId] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");

  // ✅ REGEX RULES (UNCHANGED)
  const internIdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 const handleLogin = async () => {
  if (!internIdRegex.test(internId)) {
    setError(
      "Internship ID must contain both letters and numbers (e.g. INT-2024-1056)."
    );
    return;
  }

  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!dob) {
    setError("Please select your Date of Birth.");
    return;
  }

  try {
    const API = import.meta.env.VITE_API_URL || "https://internship-backend-h82k.onrender.com";

    const response = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        internId,
        email,
        dob,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      setError(data.message || "Invalid internship details.");
      return;
    }

    if (data.requiresOtp) {
      setShowOtp(true);
      setError("");
      return;
    }

    setError("");
    setUserData(data.user);
    setIsLoggedIn(true);
    navigate("/dashboard");

  } catch (err) {
    setError("Unable to connect to server. Please try again later.");
  }
};

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const API = import.meta.env.VITE_API_URL || "https://internship-backend-h82k.onrender.com";

      const response = await fetch(`${API}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          internId,
          otp,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Invalid or expired OTP.");
        return;
      }

      setError("");
      setUserData(data.user);
      setIsLoggedIn(true);
      navigate("/dashboard");

    } catch (err) {
      setError("Unable to verify OTP. Please try again.");
    }
  };

  return (
    <div className="screen">
      {/* Header */}
      <div className="header headerCenter">
        <img
          src="https://shunyatax.in/cdn/shop/files/White_Logo.png?v=1736327446&width=130"
          alt="Logo"
          className="logo"
        />

        <div className="company companyBlack">Shunyatax Global</div>

        <div className="subtitle">
          Official Internship Certificate Portal
        </div>
      </div>

      {/* Card */}
      <div className="card">
        <div className="cardTitle">Intern Certificate Login</div>
        <div className="cardDesc">
          {showOtp 
            ? "Enter the 6-digit OTP sent to the administrator to access your certificate." 
            : "Enter your registered details to access your internship completion certificate."}
        </div>

        {!showOtp ? (
          <>
            {/* Internship ID */}
            <div className="fieldGroup">
              <label className="inputLabel">Internship ID</label>
              <input
                className="input"
                placeholder="e.g. INT-2024-1056"
                value={internId}
                onChange={(e) => setInternId(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="fieldGroup">
              <label className="inputLabel">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="yourname@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Date of Birth */}
            <div className="fieldGroup">
              <label className="inputLabel">
                Date of Birth <span className="format">(dd-mm-yyyy)</span>
              </label>
              <input
                type="date"
                className="input"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <button className="loginBtn" onClick={handleLogin}>
              Login
            </button>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <div className="fieldGroup">
              <label className="inputLabel">Enter OTP</label>
              <input
                className="input"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button className="loginBtn" onClick={handleVerifyOtp}>
              Verify OTP & Login
            </button>
            <button className="link" onClick={() => setShowOtp(false)} style={{ background: 'none', border: 'none', marginTop: '10px', color: '#007bff', cursor: 'pointer' }}>
              Back to Login
            </button>
          </>
        )}

        <div className="links">
          <span className="link">Forgot Internship ID?</span>
          <span className="link">Need Help?</span>
        </div>

        <div className="support">
          Contact Support: urgent@shunyatax.in | +91 94615 14198
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="errorBox">
          <div className="errorText">❌ {error}</div>
        </div>
      )}
    </div>
  );
}