// GalleryAdmin.jsx
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./GalleryAdmin.css";

const GalleryAdmin = () => {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setImages(data);
      } catch (err) {
        console.error("Error fetching gallery:", err);
      }
    };
    fetchImages();
  }, []);

  // Upload multiple images
  const handleUpload = async () => {
    if (files.length === 0) return alert("कृपया फोटो निवडा!");
    setLoading(true);

    try {
      for (let file of files) {
        const storageRef = ref(storage, `gallery/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        await addDoc(collection(db, "gallery"), {
          url,
          createdAt: new Date(),
        });
      }
      alert("✅ फोटो अपलोड झाले!");
      setFiles([]);
      window.location.reload();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ अपलोड अयशस्वी");
    }
    setLoading(false);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("हा फोटो हटवायचा आहे का?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      setImages(images.filter((img) => img.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  return (
    <section className="gallery-admin card">
      <h3>गॅलरी व्यवस्थापन</h3>
      <div className="gallery-admin-form">
        <input
          type="file"
          accept="image/*,image/gif"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "➕ अपलोड करा"}
        </button>
      </div>

      <div className="gallery-admin-grid">
        {images.map((img) => (
          <div key={img.id} className="gallery-admin-item">
            <img src={img.url} alt="gallery" />
            <button
              className="gallery-admin-delete"
              onClick={() => handleDelete(img.id)}
            >
              🗑️ हटवा
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryAdmin;
