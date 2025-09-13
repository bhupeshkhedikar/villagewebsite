import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import "./HeroSlider.css";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  // Fetch slides from Firestore
  useEffect(() => {
    const q = query(collection(db, "sliders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(data);
    });
    return () => unsubscribe();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (slides.length === 0) return;
    timer.current = setInterval(() => {
      setIndex(i => (i + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer.current);
  }, [slides]);

  if (slides.length === 0) return null; // No slides yet

  return (
    <section className="hero-wrap">
      <div className="hero-inner">
        {slides.map((s, i) => (
          <div key={s.id} className={`hero-slide ${i === index ? "active" : ""}`}>
            <div
              className="hero-bg"
              style={{ backgroundImage: `url(${s.img})` }}
            />
            <div className="hero-card">
              <h2 className="hero-title">{s.title}</h2>
              <p className="hero-subtitle">{s.subtitle}</p>
            </div>
          </div>
        ))}

        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
