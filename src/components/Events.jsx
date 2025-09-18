// Events.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date", "asc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data);
      } catch (err) {
        console.error("❌ कार्यक्रम आणताना त्रुटी:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="events card">
      <h3>📅 आगामी कार्यक्रम</h3>
      <ul className="event-list">
        {events.length > 0 ? (
          events.map((e) => (
            <li key={e.id} className="event-item">
              <div className="event-date">{e.date}</div>
              <div>
                <div className="event-name">{e.name}</div>
                <div className="event-place">📍 {e.place}</div>
              </div>
            </li>
          ))
        ) : (
          <p>सध्या कोणतेही कार्यक्रम उपलब्ध नाहीत.</p>
        )}
      </ul>
    </section>
  );
};

export default Events;
