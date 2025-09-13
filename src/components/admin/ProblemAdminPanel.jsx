// ProblemAdminPanel.jsx
import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import "./ProblemAdminPanel.css";

const ProblemAdminPanel = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "problems"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReports(data.sort((a, b) => b.date?.seconds - a.date?.seconds));
    });
    return () => unsub();
  }, []);

  const handleDelete = async (report) => {
    if (!window.confirm("❌ ही तक्रार delete करायची आहे का?")) return;

    try {
      // delete media from storage
      if (report.media?.length > 0) {
        for (const m of report.media) {
          try {
            const storageRef = ref(storage, m.url);
            await deleteObject(storageRef);
          } catch (err) {
            console.warn("Storage delete failed:", err.message);
          }
        }
      }

      // delete doc from firestore
      await deleteDoc(doc(db, "problems", report.id));
      alert("🗑️ Post deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed!");
    }
  };

  return (
    <section className="problem-admin-panel card">
     <h3>🛠️ तक्रारी फीड - व्यवस्थापन पॅनेल</h3>
      <div className="problem-admin-list">
        {reports.length === 0 && <p>🚫 अजून reports नाहीत</p>}
        {reports.map((r) => (
          <div key={r.id} className="problem-admin-card">
            <div className="problem-admin-header">
              <b>{r.desc}</b>
              <small>
                {r.location} • {r.date?.toDate().toLocaleString("mr-IN")}
              </small>
            </div>

            {r.media?.length > 0 && (
              <div className="problem-admin-media">
                {r.media.map((m, i) =>
                  m.type.startsWith("video") ? (
                    <video key={i} src={m.url} controls />
                  ) : (
                    <img key={i} src={m.url} alt="media" />
                  )
                )}
              </div>
            )}

            <button
              className="problem-delete-btn"
              onClick={() => handleDelete(r)}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProblemAdminPanel;
