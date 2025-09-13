// NoticeBoard.jsx
import React, { useState, useEffect } from "react";
import {db } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import "./NoticeBoard.css";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");

  // Firestore मधून notices fetch करणे
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        setNotices(data);
      } catch (err) {
        console.error("Error fetching notices:", err);
      }
    };
    fetchNotices();
  }, []);

  // नवीन notice add करणे Firestore मध्ये
  const addNotice = async () => {
    if (!text.trim()) return;

    const newNotice = {
      text,
      date: new Date().toLocaleDateString("mr-IN"),
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, "notices"), newNotice);
      setNotices([newNotice, ...notices]);
      setText("");
    } catch (err) {
      console.error("Error adding notice:", err);
    }
  };

  return (
    <section className="notice card">
      <h3>सूचना फलक</h3>
      <div className="notice-input">
        <input
          type="text"
          placeholder="नवीन सूचना लिहा..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addNotice}>➕</button>
      </div>
      <ul className="notice-list">
        {notices.map((n, i) => (
          <li key={i}>
            <span>{n.text}</span>
            <small>{n.date}</small>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NoticeBoard;
