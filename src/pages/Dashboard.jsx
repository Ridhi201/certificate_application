import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoCheckmarkCircle, IoTime, IoWarning } from "react-icons/io5";
import "../styles/dashboard.css";

export default function Dashboard({ userData }) {
  const navigate = useNavigate();
  const [requested, setRequested] = useState(userData?.certificateRequested || false);
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "https://internship-backend-h82k.onrender.com";

  const handleRequestCertificate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/request-certificate/${userData.id}`, {
        method: "POST"
      });
      const data = await response.json();
      if (response.ok) {
        setRequested(true);
        alert("Certificate request sent to Admin! They will review it shortly.");
      } else {
        alert(data.message || "Failed to request certificate");
      }
    } catch (error) {
      alert("Error reaching server");
    } finally {
      setLoading(false);
    }
  };

  const isApproved = userData?.certificateApproved;

  return (
    <div className="container">
      <div className="dashboardCard">
        {/* Back Arrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color: "#1f3c88",
            marginBottom: "14px",
            fontSize: "15px",
            fontWeight: 500,
          }}
          onClick={() => navigate("/")}
        >
          <IoArrowBack size={20} style={{ marginRight: "6px" }} />
          Back
        </div>

        {/* Title */}
        <h2 className="title">
          Welcome, {userData?.name || "User"}
        </h2>

        {/* Certificate Status */}
        <div className="status" style={{ color: isApproved ? "#1e8e3e" : requested ? "#f39c12" : "#e74c3c" }}>
          {isApproved ? (
            <><IoCheckmarkCircle size={20} /> Certificate Status: Approved ✅</>
          ) : requested ? (
            <><IoTime size={20} /> Certificate Status: Pending Approval ⏳</>
          ) : (
            <><IoWarning size={20} /> Certificate Status: Not Requested ❌</>
          )}
        </div>

        {/* Work Report Section */}
        <div className="workReport">
          <h3 className="sectionTitle">Your Work Report</h3>
          <div className="statsRow">
            <div className="statItem">
              <span className="statLabel">Total Tasks</span>
              <span className="statValue">{userData?.tasks || 0}</span>
            </div>
            <div className="statItem">
              <span className="statLabel">Hours Worked</span>
              <span className="statValue">{userData?.hours || 0}</span>
            </div>
          </div>

          {userData?.workDetails && userData.workDetails.length > 0 && (
            <div className="detailsSection">
              <h4 className="detailsTitle">Full Work Report</h4>
              <div className="tableWrapper">
                <table className="taskTable">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Task Description</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.workDetails.map((item, index) => (
                      <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.task}</td>
                        <td>{item.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {isApproved ? (
          <button
            className="button"
            onClick={() => navigate("/certificate", { state: { userData } })}
          >
            View Certificate
          </button>
        ) : (
          <button
            className="button"
            style={{ backgroundColor: requested ? "#f39c12" : "#20bf6b" }}
            onClick={handleRequestCertificate}
            disabled={loading}
          >
            {loading ? "Processing..." : requested ? "Resend Approval Link" : "Request Certificate"}
          </button>
        )}

        {/* Note */}
        <p className="note">
          {isApproved ? "Congratulations! You can now view your certificate." : requested ? "Admin will review your data and approve shortly." : "Complete your work and request approval to get your certificate."}
        </p>
      </div>
    </div>
  );
}