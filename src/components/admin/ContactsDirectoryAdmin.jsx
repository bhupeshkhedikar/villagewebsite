// ContactsDirectoryAdmin.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import "./ContactsDirectoryAdmin.css";

const ContactsDirectoryAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const q = query(collection(db, "contacts"), orderBy("name"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setContacts(data);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };
    fetchContacts();
  }, []);

  // Add or Update Contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const contactData = { name, phone };

    try {
      if (editingId) {
        const docRef = doc(db, "contacts", editingId);
        await updateDoc(docRef, contactData);
        setContacts(
          contacts.map((c) =>
            c.id === editingId ? { ...c, ...contactData } : c
          )
        );
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, "contacts"), contactData);
        setContacts([{ id: docRef.id, ...contactData }, ...contacts]);
      }

      setName("");
      setPhone("");
      alert("✅ Success!");
    } catch (err) {
      console.error(err);
      alert("❌ Operation failed");
    }
  };

  // Edit contact
  const handleEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setPhone(c.phone);
  };

  // Delete contact
  const handleDelete = async (id) => {
    if (!window.confirm("तुम्हाला संपर्क हटवायचा आहे का?")) return;
    try {
      await deleteDoc(doc(db, "contacts", id));
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  return (
    <section className="contacts-admin card">
      <h3>महत्त्वाचे संपर्क व्यवस्थापन</h3>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="नाव"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="फोन"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">
          {editingId ? "📝 अपडेट करा" : "➕ जोडा"}
        </button>
      </form>

      <ul className="contacts-list">
        {contacts.map((c) => (
          <li key={c.id} className="contact-item">
            <span>{c.name}</span>
            <small>{c.phone}</small>
            <div className="contact-actions">
              <button onClick={() => handleEdit(c)}>✏️ संपादित करा</button>
              <button onClick={() => handleDelete(c.id)}>🗑️ हटवा</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ContactsDirectoryAdmin;
