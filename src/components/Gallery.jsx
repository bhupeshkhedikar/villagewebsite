// Gallery.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(data);
      } catch (err) {
        console.error("Error fetching gallery:", err);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="gallery card">
      <h3>गॅलरी</h3>
      {images.length === 0 ? (
        <p className="empty-text">📷 अजून फोटो अपलोड केलेले नाहीत.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img) => (
            <div key={img.id} className="gallery-item">
              <img src={img.url} alt="गॅलरी फोटो" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Gallery;
