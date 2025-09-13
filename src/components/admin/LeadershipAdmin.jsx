// LeadershipAdmin.jsx
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./LeadershipAdmin.css";

const LeadershipAdmin = () => {
  const [leaders, setLeaders] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch leaders from Firestore
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(collection(db, "leaders"), orderBy("name"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeaders(data);
      } catch (err) {
        console.error("Error fetching leaders:", err);
      }
    };
    fetchLeaders();
  }, []);

  // Upload image to Firebase Storage and return URL
  const uploadImage = async (file) => {
    if (!file) return "";
    const storageRef = ref(storage, `leaders/${file.name}_${Date.now()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  // Add new leader
  const addLeader = async () => {
    if (!name.trim() || !role.trim()) return;
    setLoading(true);
    try {
      const photoURL = await uploadImage(photoFile);
      const newLeader = { name, role, phone, photo: photoURL };
      const docRef = await addDoc(collection(db, "leaders"), newLeader);
      setLeaders([{ id: docRef.id, ...newLeader }, ...leaders]);
      setName(""); setRole(""); setPhone(""); setPhotoFile(null);
    } catch (err) {
      console.error("Error adding leader:", err);
    }
    setLoading(false);
  };

  // Delete leader
  const deleteLeader = async (id) => {
    try {
      await deleteDoc(doc(db, "leaders", id));
      setLeaders(leaders.filter(l => l.id !== id));
    } catch (err) {
      console.error("Error deleting leader:", err);
    }
  };

  // Start editing
  const startEdit = (leader) => {
    setEditingId(leader.id);
    setName(leader.name);
    setRole(leader.role);
    setPhone(leader.phone);
    setPhotoFile(null); // user can upload new file
  };

  // Update leader
  const updateLeader = async () => {
    if (!name.trim() || !role.trim()) return;
    setLoading(true);
    try {
      let photoURL = leaders.find(l => l.id === editingId).photo;
      if (photoFile) {
        photoURL = await uploadImage(photoFile);
      }
      const leaderRef = doc(db, "leaders", editingId);
      await updateDoc(leaderRef, { name, role, phone, photo: photoURL });
      setLeaders(leaders.map(l => l.id === editingId ? { ...l, name, role, phone, photo: photoURL } : l));
      setEditingId(null);
      setName(""); setRole(""); setPhone(""); setPhotoFile(null);
    } catch (err) {
      console.error("Error updating leader:", err);
    }
    setLoading(false);
  };

  return (
    <section className="leadership card">
      <h3>गावाचे नेतृत्व व्यवस्थापन</h3>
      <div className="leader-form">
        <input type="text" placeholder="नाव" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="पद" value={role} onChange={(e) => setRole(e.target.value)} />
        <input type="text" placeholder="फोन" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
        {editingId ? (
          <button onClick={updateLeader} disabled={loading}>
            {loading ? "अपडेट करत आहे..." : "📝 अपडेट करा"}
          </button>
        ) : (
          <button onClick={addLeader} disabled={loading}>
            {loading ? "जोडत आहे..." : "➕ जोडा"}
          </button>
        )}
      </div>

      <div className="leader-grid">
        {leaders.map((l) => (
          <div key={l.id} className="leader-card">
            <img src={l.photo} alt={l.name} />
            <div className="leader-info">
              <div className="leader-name">{l.name}</div>
              <div className="leader-role">{l.role}</div>
              <div className="leader-phone">📞 {l.phone}</div>
              <div className="leader-actions">
                <button onClick={() => startEdit(l)}>✏️ संपादित करा</button>
                <button onClick={() => deleteLeader(l.id)}>🗑️ हटवा</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeadershipAdmin;
