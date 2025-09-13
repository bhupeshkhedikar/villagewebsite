// HealthContacts.jsx
import React from "react";
import "./HealthContacts.css";

const contacts = [
  { title: "ॲम्ब्युलन्स", phone: "१०८", icon: "🚑" },
  { title: "पोलीस", phone: "१००", icon: "👮" },
  { title: "अग्निशमन", phone: "१०१", icon: "🔥" },
  { title: "रुग्णालय", phone: "०१२३-४५६७८९", icon: "🏥" }
];

const HealthContacts = () => {
  return (
    <section className="health card">
      <h3>आरोग्य व आपत्कालीन सेवा</h3>
      <div className="health-grid">
        {contacts.map((c, i) => (
          <div key={i} className="health-card">
            <div className="health-icon">{c.icon}</div>
            <div>
              <div className="health-title">{c.title}</div>
              <div className="health-phone">{c.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HealthContacts;
