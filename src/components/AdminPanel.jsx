import React from "react";
import { collection, addDoc, deleteDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const AdminPanel = ({ workers, onUpdate }) => {
  const [newWorkerName, setNewWorkerName] = React.useState("");
  const handleAddWorker = async () => {
    if (!newWorkerName.trim()) return;

    await addDoc(collection(db, "workers"), {
      name: newWorkerName,
      isLoggedIn: false,
      late: false,
      lastLogin: null,
      totalLateMinutes: 0,
    });

    setNewWorkerName("");
    onUpdate();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      await deleteDoc(doc(db, "workers", id));
      onUpdate();
    }
  };

  const handleLogoutAll = async () => {
    const confirmed = window.confirm("Log out all workers?");
    if (!confirmed) return;

    const snapshot = await getDocs(collection(db, "workers"));
    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(doc(db, "workers", docSnap.id), {
        isLoggedIn: false,
      })
    );
    await Promise.all(updates);
    onUpdate();
  };
  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <p>Please do not abuse this menu</p>

      <input
        type="text"
        value={newWorkerName}
        onChange={(e) => setNewWorkerName(e.target.value)}
        placeholder="New worker name"
      />
      <button onClick={handleAddWorker}>Add worker</button>

      <ul>
        {workers.map((worker) => (
          <li key={worker.id}>
            {worker.name}
            <button onClick={() => handleDelete(worker.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="mass-logout-section">
        <p>Force mass logout incase of stuck state</p>
        <button onClick={handleLogoutAll}>Mass Logout</button>
      </div>
    </div>
  );
};

export default AdminPanel;
