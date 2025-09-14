// SliderUpload.jsx
import React, { useState } from "react";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import "./SliderUpload.css";

const SliderUpload = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const initialSlides = selectedFiles.map((file) => ({
      file,
      title: "",
      subtitle: "",
      preview: URL.createObjectURL(file), // preview तयार केला
    }));

    setSlides(initialSlides);
  };

  const handleChange = (index, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[index][field] = value;
    setSlides(updatedSlides);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (slides.length === 0) return;

    setLoading(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const { file, title, subtitle } = slides[i];
        const storageRef = ref(storage, `slider/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        await addDoc(collection(db, "sliders"), {
          title,
          subtitle,
          img: url,
          createdAt: new Date(),
        });
      }

      setSlides([]);
      alert("✅ सर्व स्लायडर इमेजेस अपलोड यशस्वी!");
    } catch (err) {
      console.error(err);
      alert("❌ अपलोड अयशस्वी");
    }
    setLoading(false);
  };

  return (
    <section className="slider-upload-section">
      <h3>🎨 स्लायडर इमेजेस अपलोड करा</h3>
      <form className="upload-form" onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*,image/gif"
          multiple
          onChange={handleFiles}
        />

        <div className="preview-grid">
          {slides.map((slide, index) => (
            <div key={index} className="slide-form">
              <img
                src={slide.preview}
                alt="preview"
                className="preview-img"
              />
              <p>📷 {slide.file.name}</p>
              <input
                type="text"
                placeholder="शीर्षक (Title)"
                value={slide.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
              />
              <input
                type="text"
                placeholder="उपशीर्षक (Subtitle)"
                value={slide.subtitle}
                onChange={(e) => handleChange(index, "subtitle", e.target.value)}
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "अपलोड करत आहे..." : "अपलोड करा"}
        </button>
      </form>
    </section>
  );
};

export default SliderUpload;
