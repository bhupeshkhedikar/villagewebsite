// ClassifiedsForm.jsx
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Classifieds.css";

const Classifieds = () => {
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const addAd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploading(true);

    const mediaUrls = [];
    for (const file of files) {
      const storageRef = ref(storage, `classifieds/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      mediaUrls.push({ type: file.type, url });
    }

    await addDoc(collection(db, "classifieds"), {
      title,
      contact,
      media: mediaUrls,
      date: serverTimestamp(),
    });

    setTitle("");
    setContact("");
    setFiles([]);
    setUploading(false);
    alert("✅ जाहिरात पोस्ट केली!");
  };

  return (
    <section className="classifieds-form card">
      <h3>📝 नवी जाहिरात / नोकरी पोस्ट करा</h3>
      <form onSubmit={addAd} className="class-form">
        <input
          type="text"
          placeholder="जाहिरातीचे शीर्षक..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="संपर्क माहिती"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "⏳ Upload होत आहे..." : "📤 पोस्ट करा"}
        </button>
      </form>
    </section>
  );
};

export default Classifieds;
// 