import React from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const AdminPanel = ({ workers, onUpdate }) => {
  const [newWorkerName, setNewWorkerName] = React.useState("");
  const [edits, setEdits] = React.useState({});

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
    alert("Everyone has been logged out.")
    onUpdate();
  };

  const handleLogoutOne = async (id, name) => {
    const confirmed = window.confirm(`Log out ${name}?`);
    if (!confirmed) return;

    await updateDoc(doc(db, "workers", id), { isLoggedIn: false });

    alert(`${name} has been logged out.`);
    onUpdate();
  };

  const handleEditChange = (id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = async (id) => {
    if (!edits[id]) return;

    const updates = {};
    if (edits[id].name !== undefined) updates.name = edits[id].name;
    if (edits[id].totalLateMinutes !== undefined)
      updates.totalLateMinutes = parseInt(edits[id].totalLateMinutes) || 0;

    await updateDoc(doc(db, "workers", id), updates);
    setEdits((prev) => ({ ...prev, [id]: {} }));
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
            <input
              type="text"
              value={edits[worker.id]?.name ?? worker.name}
              onChange={(e) =>
                handleEditChange(worker.id, "name", e.target.value)
              }
            />
            <input
              type="number"
              value={
                edits[worker.id]?.totalLateMinutes ??
                worker.totalLateMinutes ??
                0
              }
              onChange={(e) =>
                handleEditChange(worker.id, "totalLateMinutes", e.target.value)
              }
            />
            <button onClick={() => handleSaveChanges(worker.id)}>Save</button>
            <button onClick={() => handleDelete(worker.id)}>Delete</button>
            {worker.isLoggedIn && (
              <button onClick={() => handleLogoutOne(worker.id, worker.name)}>Logout</button>
            )}
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
