// SliderManager.jsx
import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import "./SliderManager.css";

const SliderManager = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "sliders"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSlides(data);
    });
    return () => unsub();
  }, []);

  const handleUpdate = async (id, field, value) => {
    try {
      const docRef = doc(db, "sliders", id);
      await updateDoc(docRef, { [field]: value });
      alert("✅ अपडेट यशस्वी!");
    } catch (err) {
      console.error(err);
      alert("❌ अपडेट अयशस्वी");
    }
  };

  const handleDelete = async (id, imgUrl) => {
    try {
      // Firestore delete
      await deleteDoc(doc(db, "sliders", id));

      // Storage delete
      const storageRef = ref(storage, imgUrl);
      await deleteObject(storageRef);

      alert("🗑️ इमेज delete केली!");
    } catch (err) {
      console.error(err);
      alert("❌ delete अयशस्वी");
    }
  };

  return (
    <section className="slider-manager">
      <h3>🖼️ अपलोड केलेल्या इमेजेस मॅनेज करा</h3>
      <div className="manager-grid">
        {slides.map((s) => (
          <div className="slide-card" key={s.id}>
            <img src={s.img} alt={s.title} className="slide-img" />
            <input
              type="text"
              defaultValue={s.title}
              onBlur={(e) => handleUpdate(s.id, "title", e.target.value)}
            />
            <input
              type="text"
              defaultValue={s.subtitle}
              onBlur={(e) => handleUpdate(s.id, "subtitle", e.target.value)}
            />
            <button onClick={() => handleDelete(s.id, s.img)}>❌ Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SliderManager;
