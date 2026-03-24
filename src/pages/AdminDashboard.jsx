import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoCheckmarkCircle, IoCloseCircle, IoSync } from "react-icons/io5";
import "../styles/dashboard.css"; // Reuse container styles

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "https://internship-backend-h82k.onrender.com";

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}/api/admin/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`${API}/api/admin/approve/${userId}`);
      if (response.ok) {
        alert("Approved and Email Sent!");
        fetchUsers();
      }
    } catch (error) {
      alert("Approval failed");
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch(`${API}/api/reports/trigger-automation`, { method: "POST" });
      if (response.ok) {
        alert("Automation triggered and data synced!");
        fetchUsers();
      }
    } catch (error) {
      alert("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="container" style={{ alignItems: "flex-start", paddingTop: "50px" }}>
      <div className="dashboardCard" style={{ maxWidth: "900px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
           <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#1f3c88", fontSize: "15px", fontWeight: 500 }}
            onClick={() => navigate("/")}
          >
            <IoArrowBack size={20} style={{ marginRight: "6px" }} />
            Logout
          </div>
          <button 
            className="button" 
            style={{ width: "auto", padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}
            onClick={handleSync}
            disabled={syncing}
          >
            <IoSync className={syncing ? "spin" : ""} /> {syncing ? "Syncing..." : "Sync ERPCA Data"}
          </button>
        </div>

        <h2 className="title">Admin Dashboard - User Work Reports</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f3f9", textAlign: "left" }}>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Intern ID</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Tasks</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Hours</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Status</th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{user.name}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{user.internshipId}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{user.tasks || 0}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{user.hours || 0}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                      {user.certificateApproved ? (
                        <span style={{ color: "green", display: "flex", alignItems: "center", gap: "4px" }}>
                          <IoCheckmarkCircle /> Approved
                        </span>
                      ) : (
                        <span style={{ color: "#666", display: "flex", alignItems: "center", gap: "4px" }}>
                          <IoCloseCircle /> Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                      {!user.certificateApproved && (
                        <button 
                          onClick={() => handleApprove(user._id)}
                          style={{ padding: "6px 12px", backgroundColor: "#20bf6b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
