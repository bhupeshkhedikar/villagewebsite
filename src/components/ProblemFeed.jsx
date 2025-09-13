// ProblemFeed.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import "./ProblemFeed.css";

const reactionsList = ["👍", "👎", "❤️", "😡"];

const ProblemFeed = () => {
  const [problems, setProblems] = useState([]);
  const [zoomImg, setZoomImg] = useState(null); // zoom state

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "problems"), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProblems(data.sort((a, b) => b.date?.seconds - a.date?.seconds));
    });
    return () => unsub();
  }, []);

  const toggleReaction = async (id, reaction) => {
    const docRef = doc(db, "problems", id);
    await updateDoc(docRef, {
      [`reactions.${reaction}`]:
        (problems.find((p) => p.id === id)?.reactions?.[reaction] || 0) + 1,
    });
  };

  const addComment = async (id, text) => {
    if (!text.trim()) return;
    const docRef = doc(db, "problems", id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        text,
        date: new Date().toLocaleTimeString("mr-IN"),
      }),
    });
  };

  return (
    <section className="village-feed card">
      <h3>📢 तक्रार फीड</h3>
      <div>
        {problems.map((p) => (
          <div key={p.id} className="village-problem">
            <div className="village-problem-header">
              <b>{p.desc}</b>
              <small>
                {p.location} • {p.date?.toDate().toLocaleString("mr-IN")}
              </small>
            </div>

            {p.media?.length > 0 && (
              <div className="village-media">
                {p.media.map((m, i) =>
                  m.type.startsWith("video") ? (
                    <video key={i} src={m.url} controls />
                  ) : (
                    <img
                      key={i}
                      src={m.url}
                      alt="media"
                      className="zoomable-img"
                      onClick={() => setZoomImg(m.url)} // zoom open
                    />
                  )
                )}
              </div>
            )}

            <div className="village-reactions">
              {reactionsList.map((r) => (
                <button key={r} onClick={() => toggleReaction(p.id, r)}>
                  {r} {p.reactions?.[r] || 0}
                </button>
              ))}
            </div>

            <div className="village-comments">
              <h4>💬 Comments</h4>
              {p.comments?.map((c, i) => (
                <div key={i} className="comment-item">
                  <span>{c.text}</span> &nbsp;
                  <small>{c.date}</small>
                </div>
              ))}
              <CommentBox onAdd={(text) => addComment(p.id, text)} />
            </div>
          </div>
        ))}
      </div>

      {/* Zoom Modal */}
      {zoomImg && (
        <div className="zoom-overlay" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="zoomed" className="zoomed-img" />
        </div>
      )}
    </section>
  );
};

const CommentBox = ({ onAdd }) => {
  const [text, setText] = useState("");
  return (
    <div className="village-comment-box">
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

export default ProblemFeed;
