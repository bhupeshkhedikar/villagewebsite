// Services.jsx
import React from "react";
import "./Services.css";

const services = [
  { title: "शाळा", desc: "प्राथमिक व माध्यमिक शाळा", icon: "🏫" },
  { title: "आरोग्य", desc: "प्राथमिक आरोग्य केंद्र", icon: "🏥" },
  { title: "पाणी", desc: "स्वच्छ पिण्याचे पाणी", icon: "💧" },
  { title: "वाहतूक", desc: "बस व स्थानिक वाहतूक", icon: "🚌" }
];

const Services = () => {
  return (
    <section className="services card">
      <h3>गावातील सेवा</h3>
      <div className="services-grid">
        {services.map((s, idx) => (
          <div key={idx} className="service-card">
            <div className="service-icon">{s.icon}</div>
            <div className="service-body">
              <div className="service-title">{s.title}</div>
              <div className="service-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
