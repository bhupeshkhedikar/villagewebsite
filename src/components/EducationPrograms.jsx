// EducationPrograms.jsx
import React from "react";
import "./EducationPrograms.css";

const programs = [
  { title: "शिष्यवृत्ती", desc: "उच्च शिक्षणासाठी मदत", icon: "🎓" },
  { title: "युवक मंडळ", desc: "क्रीडा व उपक्रम", icon: "⚽" },
  { title: "कौशल्य प्रशिक्षण", desc: "शिवणकाम व संगणक वर्ग", icon: "🛠" }
];

const EducationPrograms = () => {
  return (
    <section className="education card">
      <h3>शिक्षण व युवक</h3>
      <div className="edu-list">
        {programs.map((p, i) => (
          <div key={i} className="edu-card">
            <div className="edu-icon">{p.icon}</div>
            <div>
              <div className="edu-title">{p.title}</div>
              <div className="edu-desc">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationPrograms;
