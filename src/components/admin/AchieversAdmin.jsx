import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AchieversAdmin.css";

const AchieversAdmin = () => {
  const [villagers, setVillagers] = useState([]);
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVillagers = async () => {
      try {
        const q = query(collection(db, "achievers"), orderBy("year", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVillagers(data);
      } catch (err) {
        console.error("Error fetching villagers:", err);
      }
    };
    fetchVillagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !year.trim()) return;

    setLoading(true);
    let imgUrl = "";

    try {
      if (image) {
        const storageRef = ref(storage, `villagers/${image.name}`);
        await uploadBytes(storageRef, image);
        imgUrl = await getDownloadURL(storageRef);
      }

      const villagerData = { name, year, desc, img: imgUrl || "" };

      if (editingId) {
        const docRef = doc(db, "achievers", editingId);
        await updateDoc(docRef, villagerData);
        setVillagers(villagers.map(v => v.id === editingId ? { ...v, ...villagerData } : v));
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, "achievers"), villagerData);
        setVillagers([{ id: docRef.id, ...villagerData }, ...villagers]);
      }

      setName(""); setYear(""); setDesc(""); setImage(null);
      alert("✅ Operation Successful!");
    } catch (err) {
      console.error(err);
      alert("❌ Operation failed");
    }
    setLoading(false);
  };

  const handleEdit = (v) => {
    setEditingId(v.id);
    setName(v.name);
    setYear(v.year);
    setDesc(v.desc);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("तुम्हाला हटवायचे आहे का?")) return;
    try {
      await deleteDoc(doc(db, "achievers", id));
      setVillagers(villagers.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  return (
    <section className="villagers-admin card">
      <h3>अभिमानास्पद गावकरी व्यवस्थापन</h3>
      <form className="villager-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="नाव" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="वर्ष" value={year} onChange={(e) => setYear(e.target.value)} />
        <textarea placeholder="वर्णन" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : editingId ? "📝 अपडेट करा" : "➕ जोडा"}
        </button>
      </form>

      <div className="villagers-grid">
        {villagers.map(v => (
          <div key={v.id} className="villager-card">
            {v.img && <img src={v.img} alt={v.name} className="villager-img" />}
            <div>
              <h3>{v.name} ({v.year})</h3>
              <p>{v.desc}</p>
              <div className="villager-actions">
                <button onClick={() => handleEdit(v)}>✏️ संपादित करा</button>
                <button onClick={() => handleDelete(v.id)}>🗑️ हटवा</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AchieversAdmin;
