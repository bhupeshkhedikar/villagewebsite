// UserEventsFeed.jsx
import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./UserEventsFeed.css";

const reactionsList = ["👍", "👎", "❤️", "😮"];

const UserEventsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  // Fetch posts from 'userEvents' collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "userEvents"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(data.sort((a, b) => b.date?.seconds - a.date?.seconds));
      }
    );
    return () => unsub();
  }, []);

  // Add new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !eventDate) return;

    setUploading(true);
    const mediaUrls = [];

    try {
      for (const file of files) {
        const storageRef = ref(storage, `userEvents/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        mediaUrls.push({ type: file.type, url });
      }

      await addDoc(collection(db, "userEvents"), {
        title,
        desc,
        date: eventDate,
        media: mediaUrls,
        createdAt: serverTimestamp(),
        reactions: {},
        comments: [],
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

  // Toggle reactions
  const toggleReaction = async (id, reaction) => {
    const docRef = doc(db, "userEvents", id);
    const post = posts.find((p) => p.id === id);
    await updateDoc(docRef, {
      [`reactions.${reaction}`]: (post?.reactions?.[reaction] || 0) + 1,
    });
  };

  // Add comment
  const addComment = async (id, text) => {
    if (!text.trim()) return;
    const docRef = doc(db, "userEvents", id);
    await updateDoc(docRef, {
      comments: arrayUnion({ text, date: new Date().toLocaleTimeString("mr-IN") }),
    });
  };

  return (
    <section className="ue-feed-card">
      <h3 className="ue-feed-title">📅 गावचे कार्यक्रम / पोस्ट करा</h3>

      {/* Upload Form */}
      <form className="ue-feed-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="शीर्षक"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="ue-feed-input"
        />
        <textarea
          placeholder="वर्णन"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="ue-feed-textarea"
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="ue-feed-date"
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="ue-feed-files"
        />
        <button type="submit" disabled={uploading} className="ue-feed-button">
          {uploading ? "अपलोड करत आहे..." : "📤 पोस्ट करा"}
        </button>
      </form>

      {/* Feed */}
      <div className="ue-feed-list">
        {posts.map((p) => (
          <div key={p.id} className="ue-feed-post">
            <h4 className="ue-feed-post-title">{p.title}</h4>
            <small className="ue-feed-post-date">{p.date}</small>
            <p className="ue-feed-post-desc">{p.desc}</p>

            {/* Media */}
            <div className="ue-feed-media">
              {p.media?.map((m, i) =>
                m.type.startsWith("video") ? (
                  <video key={i} src={m.url} controls className="ue-feed-video" />
                ) : (
                  <div
                    key={i}
                    className="ue-feed-image-container"
                    onClick={() => setZoomImage(m.url)}
                  >
                    <img src={m.url} alt={p.title} className="ue-feed-image" />
                  </div>
                )
              )}
            </div>

            {/* Reactions */}
            <div className="ue-feed-reactions">
              {reactionsList.map((r) => (
                <button key={r} onClick={() => toggleReaction(p.id, r)}>
                  {r} {p.reactions?.[r] || 0}
                </button>
              ))}
            </div>

            {/* Comments */}
            <div className="ue-feed-comments">
              {p.comments?.map((c, i) => (
                <div key={i} className="ue-feed-comment-item">
                  <span>{c.text}</span>
                  <small>{c.date}</small>
                </div>
              ))}
              <CommentBox onAdd={(text) => addComment(p.id, text)} />
            </div>
          </div>
        ))}
      </div>

      {/* Zoomed Image */}
      {zoomImage && (
        <div className="ue-feed-image-fullscreen" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="Zoomed" />
        </div>
      )}
    </section>
  );
};

const CommentBox = ({ onAdd }) => {
  const [text, setText] = useState("");
  return (
    <div className="ue-feed-comment-box">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          onAdd(text);
          setText("");
        }}
      >
        ➕
      </button>
    </div>
  );
};

export default UserEventsFeed;
