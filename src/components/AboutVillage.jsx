// AboutVillage.jsx
import React from "react";
import "./AboutVillage.css";

const AboutVillage = () => {
  return (
    <section className="about-section card">
      <div className="about-left">
        <h2>🌾 आमचं गाव</h2>
        <p>
          आमचं लाखोरी गाव निसर्गसंपन्न आणि पारंपरिक संस्कृती जपणारं आहे.
          येथील लोक मेहनती व एकत्रित राहणारे असून शेती हा मुख्य व्यवसाय आहे.
          सण-उत्सव, जत्रा आणि पारंपरिक कला-प्रकार गावाला एक वेगळी ओळख देतात.
        </p>

        <div className="culture-tags">
          <span className="tag">सण-उत्सव</span>
          <span className="tag">शेती</span>
          <span className="tag">संस्कृती</span>
        </div>
      </div>

      <div className="about-right">
        <div className="about-image" />
      </div>
    </section>
  );
};

export default AboutVillage;
