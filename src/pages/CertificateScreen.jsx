import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack, IoEye, IoDownload, IoClose } from "react-icons/io5";
import html2pdf from "html2pdf.js";
import "../styles/certificate.css";

export default function Certificate() {
  const navigate = useNavigate();
  const location = useLocation();
  const certRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);

  // ✅ USER DATA (dynamic / fallback)
  const user =
    location.state?.userData || {
      name: "User",
      position: "Intern",
      startDate: "---",
      endDate: "---",
      duration: "One Month",
      issueDate: new Date().toLocaleDateString('en-GB'),
    };

  // ✅ SINGLE-PAGE PDF DOWNLOAD (BACKGROUND + TEXT)
  const downloadCertificate = () => {
    if (!certRef.current) return;

    html2pdf()
      .from(certRef.current)
      .set({
        filename: `${user.name}_Certificate.pdf`,
        margin: 0,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
        },
        jsPDF: {
          unit: "mm",
          format: [297, 210], // A4 LANDSCAPE
          orientation: "landscape",
        },
        pagebreak: { mode: ["avoid-all"] },
      })
      .save();
  };

  return (
    <div className="certificateScreen">
      {/* HEADER */}
      <div className="certHeaderBar">
        <div className="backBtn" onClick={() => navigate("/dashboard")}>
          <IoArrowBack size={20} />
          <span>Back</span>
        </div>
        <h2>Certificate Portal</h2>
      </div>

      {/* USER INFO */}
      <div className="userInfoCard">
        <h3>Welcome, {user.name}</h3>
        <p>
          Internship Domain: <strong>{user.position}</strong>
        </p>
        <p>
          Duration: {user.startDate} – {user.endDate}
        </p>
        <p className="statusApproved">Certificate Status: Approved ✅</p>
      </div>

      {/* CERTIFICATE CARD */}
      <div className="certificateCard">
        <div className="certificateTitleRow">
          <h3>Certificate of Completion</h3>
          <span className="available">✔ Available</span>
        </div>

        {/* CERTIFICATE (MAIN SCREEN + PDF SOURCE) */}
        <div
          ref={certRef}
          className={`certificatePreview ${showPreview ? "previewZoom" : ""}`}
        >
          <img
            src="/certificate.jpeg"
            alt="Certificate"
            className="certificateImage"
          />

          <div className="certName">{user.name}</div>

          <div className="certBody">
            This is to certify that <strong>{user.name}</strong> has successfully
            completed a <strong>{user.duration}</strong> internship as a{" "}
            <strong>{user.position}</strong> with our organization from{" "}
            <strong>{user.startDate}</strong> to{" "}
            <strong>{user.endDate}</strong>. During his tenure, he demonstrated
            professionalism, technical competence, and commitment to assigned
            responsibilities. We wish him continued success in his future
            professional pursuits.
          </div>

          <div className="certDateLeft">Date: – {user.issueDate || new Date().toLocaleDateString('en-GB')}</div>
          <div className="certDateRight">{user.endDate}</div>
        </div>

        {/* ACTIONS */}
        <div className="certActions">
          <button className="viewBtn" onClick={() => setShowPreview(true)}>
            <IoEye /> View Certificate
          </button>

          <button className="downloadBtn" onClick={downloadCertificate}>
            <IoDownload /> Download Certificate (PDF)
          </button>
        </div>
      </div>

      <div className="infoBox">
        🎉 Congratulations on completing your internship!
      </div>

      {/* FULL SCREEN VIEW */}
      {showPreview && (
        <div className="certificateModal">
          <button
            className="closeModal"
            onClick={() => setShowPreview(false)}
          >
            <IoClose size={30} />
          </button>
        </div>
      )}
    </div>
  );
}