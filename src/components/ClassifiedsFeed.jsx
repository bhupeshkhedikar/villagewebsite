import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import "./ClassifiedsFeed.css";

const reactionsList = ["👍", "👎", "❤️", "😡"];

const ClassifiedsFeed = () => {
  const [ads, setAds] = useState([]);
  const [zoomSrc, setZoomSrc] = useState(null);

  // Fetch classifieds feed from Firebase
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "classifieds"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAds(data.sort((a, b) => b.date?.seconds - a.date?.seconds));
    });
    return () => unsub();
  }, []);

  // Toggle reaction count
  const toggleReaction = async (id, reaction) => {
    const docRef = doc(db, "classifieds", id);
    await updateDoc(docRef, {
      [`reactions.${reaction}`]:
        (ads.find((a) => a.id === id)?.reactions?.[reaction] || 0) + 1,
    });
  };

  // Add comment
  const addComment = async (id, text) => {
    if (!text.trim()) return;
    const docRef = doc(db, "classifieds", id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        text,
        date: new Date().toLocaleTimeString("mr-IN"),
      }),
    });
  };

  return (
    <section className="classifieds-feed card">
      <h3>📢 जाहिराती / नोकऱ्या फीड</h3>
      <div className="classifieds-feed-list">
        {ads.map((ad) => (
          <div key={ad.id} className="classifieds-feed-card">
            <div className="classifieds-feed-header">
              <b>{ad.title}</b>
              <small>{ad.contact} • {ad.date?.toDate().toLocaleString("mr-IN")}</small>
            </div>

            {ad.media?.length > 0 && (
              <div className="classifieds-feed-media">
                {ad.media.map((m, i) =>
                  m.type.startsWith("video") ? (
                    <video
                      key={i}
                      src={m.url}
                      controls
                      onClick={() => setZoomSrc(m.url)}
                    />
                  ) : (
                    <img
                      key={i}
                      src={m.url}
                      alt="media"
                      onClick={() => setZoomSrc(m.url)}
                    />
                  )
                )}
              </div>
            )}

            <div className="classifieds-feed-actions">
              {reactionsList.map((r) => (
                <button key={r} onClick={() => toggleReaction(ad.id, r)}>
                  {r} {ad.reactions?.[r] || 0}
                </button>
              ))}
            </div>

            <div className="classifieds-feed-comments">
              <h4>💬 Comments</h4>
              {ad.comments?.map((c, i) => (
                <div key={i} className="classifieds-feed-comment">
                  <span>{c.text}</span>
                  <small>{c.date}</small>
                </div>
              ))}
              <CommentBox onAdd={(text) => addComment(ad.id, text)} />
            </div>
          </div>
        ))}
      </div>

      {/* Zoom Overlay */}
      {zoomSrc && (
        <div className="classifieds-feed-zoom" onClick={() => setZoomSrc(null)}>
          <img src={zoomSrc} alt="zoomed" />
        </div>
      )}
    </section>
  );
};

const CommentBox = ({ onAdd }) => {
  const [text, setText] = useState("");
  return (
    <div className="classifieds-feed-comment-box">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          onAdd(text);
          setText("");
        }}
      >
        ➕
      </button>
    </div>
  );
};

export default ClassifiedsFeed;
