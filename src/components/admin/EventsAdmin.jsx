// EventsAdmin.jsx
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
import "./EventsAdmin.css";

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("date"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Add Event
  const addEvent = async () => {
    if (!date.trim() || !name.trim() || !place.trim()) return;
    const newEvent = { date, name, place };

    try {
      const docRef = await addDoc(collection(db, "events"), newEvent);
      setEvents([{ id: docRef.id, ...newEvent }, ...events]);
      setDate("");
      setName("");
      setPlace("");
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // Delete Event
  const deleteEvent = async (id) => {
    if (!window.confirm("तुम्हाला कार्यक्रम हटवायचा आहे का?")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Edit Event
  const startEdit = (event) => {
    setEditingId(event.id);
    setDate(event.date);
    setName(event.name);
    setPlace(event.place);
  };

  // Update Event
  const updateEvent = async () => {
    if (!date.trim() || !name.trim() || !place.trim()) return;
    try {
      const eventRef = doc(db, "events", editingId);
      await updateDoc(eventRef, { date, name, place });
      setEvents(
        events.map((e) =>
          e.id === editingId ? { ...e, date, name, place } : e
        )
      );
      setEditingId(null);
      setDate("");
      setName("");
      setPlace("");
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  return (
    <section className="events-admin card">
      <h3>कार्यक्रम व्यवस्थापन</h3>

      <div className="event-form">
        <input
          type="text"
          placeholder="तारीख"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="कार्यक्रमाचे नाव"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="स्थळ"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />

        {editingId ? (
          <button onClick={updateEvent}>📝 अपडेट</button>
        ) : (
          <button onClick={addEvent}>➕ जोडा</button>
        )}
      </div>

      <ul className="event-list-admin">
        {events.map((e) => (
          <li key={e.id} className="event-item-admin">
            <div className="event-info">
              <span className="event-date">{e.date}</span>
              <span className="event-name">{e.name}</span>
              <span className="event-place">{e.place}</span>
            </div>
            <div className="event-actions">
              <button onClick={() => startEdit(e)}>✏️ संपादित</button>
              <button onClick={() => deleteEvent(e.id)}>🗑️ हटवा</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EventsAdmin;
