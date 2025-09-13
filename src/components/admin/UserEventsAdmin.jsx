// UserEventsAdmin.jsx
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import "./UserEventsAdmin.css";

const UserEventsAdmin = () => {
  const [posts, setPosts] = useState([]);

  // Fetch all posts from 'userEvents' collection
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "userEvents"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      }
    );
    return () => unsub();
  }, []);

  // Delete post
  const handleDelete = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    // Delete media from Firebase Storage
    if (post.media?.length > 0) {
      for (const m of post.media) {
        const fileRef = ref(storage, m.url.split("?")[0].split("%2F").slice(-2).join("/"));
        try {
          await deleteObject(fileRef);
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }
    }

    // Delete document from Firestore
    await deleteDoc(doc(db, "userEvents", post.id));
  };

  return (
    <section className="ue-admin-card">
      <h3 className="ue-admin-title">🛠️ गावचे कार्यक्रम - Admin Panel</h3>

      <div className="ue-admin-list">
        {posts.map((p) => (
          <div key={p.id} className="ue-admin-post">
            <h4 className="ue-admin-post-title">{p.title}</h4>
            <small className="ue-admin-post-date">{p.date}</small>
            <p className="ue-admin-post-desc">{p.desc}</p>

            <div className="ue-admin-media">
              {p.media?.map((m, i) =>
                m.type.startsWith("video") ? (
                  <video key={i} src={m.url} controls className="ue-admin-video" />
                ) : (
                  <img key={i} src={m.url} alt={p.title} width={150} />
                )
              )}
            </div>

            <button
              className="ue-admin-delete-btn"
              onClick={() => handleDelete(p)}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserEventsAdmin;
