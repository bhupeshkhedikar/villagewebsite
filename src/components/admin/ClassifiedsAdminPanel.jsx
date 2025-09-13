// ClassifiedsAdminPanel.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import "./ClassifiedsAdminPanel.css";

const ClassifiedsAdminPanel = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "classifieds"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAds(data.sort((a, b) => b.date?.seconds - a.date?.seconds));
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("❌ ही जाहिरात delete करायची आहे का?")) return;
    await deleteDoc(doc(db, "classifieds", id));
    alert("🗑️ जाहिरात हटवली!");
  };

  return (
<section className="classifieds-admin-panel">
<h3 className="classifieds-admin-title">🛠️ जाहिराती व्यवस्थापन पॅनेल</h3>
  <div className="classifieds-admin-list">
    {ads.map((a) => (
      <div key={a.id} className="classifieds-admin-card">
        <div className="classifieds-admin-info">
          <b>{a.title}</b>
          <p>📞 {a.contact}</p>

          {a.media?.length > 0 && (
            <div className="classifieds-admin-media">
              {a.media.map((m, i) =>
                m.type.startsWith("video") ? (
                  <video key={i} src={m.url} controls />
                ) : (
                  <img key={i} src={m.url} alt="media" />
                )
              )}
            </div>
          )}

          <small className="classifieds-admin-date">
            {a.date?.toDate().toLocaleString("mr-IN")}
          </small>
        </div>
        <button
          onClick={() => handleDelete(a.id)}
          className="classifieds-admin-delete-btn"
        >
          🗑️ Delete
        </button>
      </div>
    ))}
  </div>
</section>

  );
};

export default ClassifiedsAdminPanel;
