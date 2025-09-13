// NoticeBoardAdmin.jsx
import React, { useState, useEffect } from "react";
import {  db } from "../../firebase";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import "./NoticeBoardAdmin.css";

const NoticeBoardAdmin = () => {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch notices from Firestore
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotices(data);
      } catch (err) {
        console.error("Error fetching notices:", err);
      }
    };
    fetchNotices();
  }, []);

  // Add new notice
  const addNotice = async () => {
    if (!text.trim()) return;
    const newNotice = {
      text,
      date: new Date().toLocaleDateString("mr-IN"),
      createdAt: new Date()
    };

    try {
      const docRef = await addDoc(collection(db, "notices"), newNotice);
      setNotices([{ id: docRef.id, ...newNotice }, ...notices]);
      setText("");
    } catch (err) {
      console.error("Error adding notice:", err);
    }
  };

  // Delete notice
  const deleteNotice = async (id) => {
    try {
      await deleteDoc(doc(db, "notices", id));
      setNotices(notices.filter(n => n.id !== id));
    } catch (err) {
      console.error("Error deleting notice:", err);
    }
  };

  // Start editing
  const startEdit = (notice) => {
    setEditingId(notice.id);
    setText(notice.text);
  };

  // Update notice
  const updateNotice = async () => {
    if (!text.trim()) return;
    try {
      const noticeRef = doc(db, "notices", editingId);
      await updateDoc(noticeRef, { text, date: new Date().toLocaleDateString("mr-IN") });
      setNotices(notices.map(n => n.id === editingId ? { ...n, text, date: new Date().toLocaleDateString("mr-IN") } : n));
      setEditingId(null);
      setText("");
    } catch (err) {
      console.error("Error updating notice:", err);
    }
  };

  return (
    <section className="notice card">
      <h3>सूचना फलक व्यवस्थापन</h3>
      <div className="notice-input">
        <input
          type="text"
          placeholder="नवीन सूचना लिहा..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {editingId ? (
          <button onClick={updateNotice}>📝 अपडेट करा</button>
        ) : (
          <button onClick={addNotice}>➕</button>
        )}
      </div>
      <ul className="notice-list">
        {notices.map((n) => (
          <li key={n.id}>
            <span>{n.text}</span>
            <small>{n.date}</small>
            <div className="notice-actions">
              <button onClick={() => startEdit(n)}>✏️ संपादित करा</button>
              <button onClick={() => deleteNotice(n.id)}>🗑️ हटवा</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NoticeBoardAdmin;
