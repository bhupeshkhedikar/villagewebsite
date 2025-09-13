import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import "./Leadership.css";

const Leadership = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // Order by creation time descending (latest first)
    const q = query(collection(db, "leaders"), orderBy("name"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaders(data);
    }, (error) => {
      console.error("Error fetching leaders:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="leadership card">
      <h3>गावाचे नेतृत्व</h3>
      <div className="leader-grid">
        {leaders.map((l) => (
          <div key={l.id} className="leader-card">
            <img src={l.photo} alt={l.name} />
            <div className="leader-info">
              <div className="leader-name">{l.name}</div>
              <div className="leader-role">{l.role}</div>
              <div className="leader-phone">📞 {l.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Leadership;
