// EventsFeed.jsx
import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./EventsFeedUnique.css";

const EventsFeedUnique = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch events
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Handle upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !eventDate) return;

    setUploading(true);
    const mediaUrls = [];

    try {
      for (const file of files) {
        const storageRef = ref(storage, `events/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        mediaUrls.push({ type: file.type, url });
      }

      await addDoc(collection(db, "events"), {
        title,
        desc,
        date: eventDate,
        media: mediaUrls,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDesc("");
      setEventDate("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }

    setUploading(false);
  };

  return (
    <section className="events-feed-unique-card">
      <h3 className="events-feed-unique-title">📅 आगामी कार्यक्रम / आपल्या कार्यक्रम पोस्ट करा</h3>

      <form className="events-feed-unique-form" onSubmit={handleSubmit}>
        <input
          className="events-feed-unique-input"
          type="text"
          placeholder="शीर्षक"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="events-feed-unique-textarea"
          placeholder="वर्णन"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          className="events-feed-unique-date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
        <input
          className="events-feed-unique-files"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <button
          className="events-feed-unique-button"
          type="submit"
          disabled={uploading}
        >
          {uploading ? "अपलोड करत आहे..." : "📤 पोस्ट करा"}
        </button>
      </form>

      <div className="events-feed-unique-list">
        {posts.map((ev) => (
          <div key={ev.id} className="events-feed-unique-post">
            <h4 className="events-feed-unique-post-title">{ev.title}</h4>
            <small className="events-feed-unique-post-date">{ev.date}</small>
            <p className="events-feed-unique-post-desc">{ev.desc}</p>
            <div className="events-feed-unique-media">
              {ev.media?.map((m, i) =>
                m.type.startsWith("video") ? (
                  <video
                    key={i}
                    className="events-feed-unique-video"
                    src={m.url}
                    controls
                  />
                ) : (
                  <img
                    key={i}
                    className="events-feed-unique-image"
                    src={m.url}
                    alt={ev.title}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsFeedUnique;
