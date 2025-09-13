// ProblemReportingForm.jsx
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./ProblemReporting.css";

const ProblemReportingForm = () => {
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc || !location) return;

    setUploading(true);
    setProgress(0);

    const mediaUrls = [];
    for (const file of files) {
      const storageRef = ref(storage, `problems/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Math.round(prog));
          },
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            mediaUrls.push({ type: file.type, url });
            resolve();
          }
        );
      });
    }

    await addDoc(collection(db, "problems"), {
      desc,
      location,
      media: mediaUrls,
      date: serverTimestamp(),
      reactions: {},
      comments: [],
    });

    setDesc("");
    setLocation("");
    setFiles([]);
    setUploading(false);
    setProgress(0);
    alert("✅ Report submitted!");
  };

  return (
    <section className="problem card">
      <h3>तक्रार नोंदवा</h3>
      <form onSubmit={handleSubmit} className="problem-form">
        <input
          type="text"
          placeholder="संक्षिप्त वर्णन"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="text"
          placeholder="ठिकाण / रस्ता"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />

        {uploading && (
          <div className="upload-progress">
            <div
              className="upload-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <span>{progress}%</span>
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? "⏳ Uploading..." : "📤 सबमिट करा"}
        </button>
      </form>
    </section>
  );
};

export default ProblemReportingForm;
