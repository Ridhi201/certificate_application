import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/LoginScreen.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Certificate from "./pages/CertificateScreen.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// global css imports
import "./styles/login.css";
import "./styles/dashboard.css";
import "./styles/certificate.css";

export default function App() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>

        {/* Login Route */}
        <Route
          path="/"
          element={
            <Login
              setUserData={setUserData}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard userData={userData} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Protected Certificate Route */}
        <Route
          path="/certificate"
          element={
            isLoggedIn ? (
              <Certificate userData={userData} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Admin Dashboard Route */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </Router>
  );
}