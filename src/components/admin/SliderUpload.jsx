// SliderUpload.jsx
import React, { useState } from "react";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import "./SliderUpload.css";

const SliderUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const storageRef = ref(storage, `slider/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "sliders"), {
        title,
        subtitle,
        img: url,
        createdAt: new Date()
      });

      setFile(null);
      setTitle("");
      setSubtitle("");
      alert("✅ Slider image अपलोड यशस्वी!");
    } catch (err) {
      console.error(err);
      alert("❌ अपलोड अयशस्वी");
    }
    setLoading(false);
  };

  return (
    <section className="slider-upload-section">
      <h3>🎨 स्लायडर इमेज अपलोड करा</h3>
      <form className="upload-form" onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="शीर्षक (Title)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="उपशीर्षक (Subtitle)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "अपलोड करत आहे..." : "अपलोड करा"}
        </button>
      </form>
    </section>
  );
};

export default SliderUpload;
