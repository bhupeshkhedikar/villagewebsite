// ContactsDirectory.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./ContactsDirectory.css";

const ContactsDirectory = () => {
  const [contacts, setContacts] = useState([]);

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

  return (
    <section className="directory card">
      <h3>महत्त्वाचे संपर्क</h3>
      {contacts.length === 0 ? (
        <p className="empty-msg">संपर्क उपलब्ध नाहीत.</p>
      ) : (
        <ul className="dir-list">
          {contacts.map((c) => (
            <li key={c.id}>
              <span>{c.name}</span>
              <small>{c.phone}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ContactsDirectory;
