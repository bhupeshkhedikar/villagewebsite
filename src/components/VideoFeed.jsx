// VideoFeed.jsx
import React, { useState, useEffect } from "react";
import "./VideoFeed.css";

const VideoFeed = () => {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("village_videos");
    if (saved) setVideos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("village_videos", JSON.stringify(videos));
  }, [videos]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newVideo = {
        src: reader.result,
        desc,
        date: new Date().toLocaleString(),
      };
      setVideos([newVideo, ...videos]);
      setFile(null);
      setDesc("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="video-feed card">
      <h3>🎥 Video Feed</h3>

      <form className="upload-form" onSubmit={handleUpload}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Write a short description..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>

      <div className="video-list">
        {videos.map((v, i) => (
          <div key={i} className="video-card">
            <video controls src={v.src}></video>
            <p className="video-desc">{v.desc}</p>
            <small className="video-date">{v.date}</small>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoFeed;
