// Achievers.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import "./Achievers.css";

const fallbackImg = "https://terrybrock.com/wp-content/uploads/2017/02/Success.jpg"; // replace with any good fallback image URL

const Achievers = () => {
  const [achievers, setAchievers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "achievers"), orderBy("year", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAchievers(data);
      },
      (error) => {
        console.error("Error fetching achievers:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="achievers-section">
      <h3 className="achievers-title">🌟गौरवाचे तारे</h3>
      <div className="achievers-grid">
        {achievers.map((a) => (
          <div className="achiever-card" key={a.id}>
            <div className="achiever-top">
              <img
                src={a.img || fallbackImg}
                alt={a.name}
                className="achiever-img"
                onError={(e) => { e.target.src = fallbackImg; }}
              />
              <div>
                <h3 className="achiever-name">{a.name}</h3>
                <span className="achiever-year">({a.year})</span>
              </div>
            </div>
            <p className="achiever-desc">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievers;
