// ContactMap.jsx
import React from "react";
import "./ContactMap.css";

const ContactMap = () => {
  return (
    <section className="contact-map card">
      <h3>📍 संपर्क व ठिकाण</h3>
      <div className="map-box">
        <iframe
          title="village-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.1234567890123!2d79.545678!3d21.178901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd123456789abcd%3A0xabcdef1234567890!2sLakhori%2C%20Bhandara%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1694461234567"
          width="100%"
          height="220"
          style={{ border: 0, borderRadius: "8px" }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
      <div className="contact-info">
        <p><b>🏢 ग्रामपंचायत कार्यालय</b></p>
        <p>📞 फोन: <a href="tel:0123999999">80807158445</a></p>
        {/* <p>📧 ईमेल: <a href="mailto:info@village.com">info@village.com</a></p> */}
      </div>
    </section>
  );
};

export default ContactMap;
