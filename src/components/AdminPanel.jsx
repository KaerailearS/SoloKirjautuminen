import React from "react";
import styles from "../styles/AdminPanel.module.css";
import finnish from "../languages/finnish";
import english from "../languages/english";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";


// Admin panel only for administrative use, contains functionalities for adding new workers, editing data, archiving and logging out.
const AdminPanel = ({ workers, onUpdate, texts }) => {
  const [newWorkerName, setNewWorkerName] = React.useState("");
  const [edits, setEdits] = React.useState({});
  const [showInactiveWorkers, setShowInactiveWorkers] = React.useState(false);
  const [inactiveWorkers, setInactiveWorkers] = React.useState([]);

  // add worker into the Firestore "workers" collection, only the name is variable dependant, other data is initially fixed
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

  // archiving worker - moves worker and all data to "inactive workers" collection, saves the Firestore ID, so it will be re-used if unarchived
  const handleArchive = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to archive ${name}?`
    );
    if (!confirmed) return;

    const workerRef = doc(db, "workers", id);
    const snapshot = await getDoc(workerRef);

    if (!snapshot.exists()) {
      alert("Worker not found.");
      return;
    }

    const workerData = snapshot.data();

    const inactiveRef = doc(db, "inactiveWorkers", id);
    await setDoc(inactiveRef, workerData);

    await deleteDoc(workerRef);

    alert(`${name} has been archived.`);
    onUpdate();
  };

  // fetch function for inhabiting the archive
  const fetchInactiveWorkers = async () => {
    const snapshot = await getDocs(collection(db, "inactiveWorkers"));
    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    result.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
    setInactiveWorkers(result);
  };

  // reactivating archived worker - uses previously determined Firestore ID to pull worker back into the active "workers" folder, with all previous data intact
  const handleReactivate = async (worker) => {
    const confirmed = window.confirm(
      `Are you sure you want to reactivate ${worker.name}?`
    );
    if (!confirmed) return;
    const inactiveRef = doc(db, "inactiveWorkers", worker.id);
    const snapshot = await getDoc(inactiveRef);

    if (!snapshot.exists()) {
      alert("Inactive worker not found.");
      return;
    }
    const workerData = snapshot.data();
    const workerRef = doc(db, "workers", worker.id);
    await setDoc(workerRef, {
      ...workerData,
      isLoggedIn: false,
      lastLogin: null,
    });

    await deleteDoc(inactiveRef);

    alert(`${worker.name} has been reactivated.`);
    onUpdate();
  };

  // masslogout functionality for stuck states or other problematic scenarios
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
    alert("Everyone has been logged out.");
    onUpdate();
  };

  // logging out individuals for stuck states or other problematic scenarios
  const handleLogoutOne = async (id, name) => {
    const confirmed = window.confirm(`Log out ${name}?`);
    if (!confirmed) return;

    await updateDoc(doc(db, "workers", id), { isLoggedIn: false });

    alert(`${name} has been logged out.`);
    onUpdate();
  };

  // functionality for editing name or time late
  const handleEditChange = (id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // applies the above mentioned edits
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

  // admin panel only gets rendered in once a certain hotkey(or combination) is pressed. Renders in a title, input form for adding worker, a list of all active workers with edit inputs for name and time late, buttons for saving edits, archiving and logging out. At the bottom it has the mass logout button and toggleable archive, where all "inactive workers" reside and can be reactivated from.
  return (
    <div className={styles.adminPanel}>
      <h2 className={styles.heading}>{texts.adminPanel}</h2>
      <p className={styles.note}>{texts.adminNote}</p>
      <form onSubmit={(e) =>{
        e.preventDefault()
        handleAddWorker()
      }}>
        <input
          type="text"
          value={newWorkerName}
          onChange={(e) => setNewWorkerName(e.target.value)}
          placeholder={texts.newWorkerPlaceholder}
          className={styles.input}
        />
        <button className={styles.button}>
          {texts.addWorker}
        </button>
      </form>

      <ul>
        {workers.map((worker) => (
          <li key={worker.id}>
            <input
              type="text"
              className={styles.input}
              value={edits[worker.id]?.name ?? worker.name}
              onChange={(e) =>
                handleEditChange(worker.id, "name", e.target.value)
              }
              onKeyDown={(e)=>{
                if (e.key === "Enter"){
                  e.preventDefault()
                  handleSaveChanges(worker.id)
                }
              }}
            />
            <input
              type="number"
              className={styles.input}
              value={
                edits[worker.id]?.totalLateMinutes ??
                worker.totalLateMinutes ??
                0
              }
              onChange={(e) =>
                handleEditChange(worker.id, "totalLateMinutes", e.target.value)
              }
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  e.preventDefault()
                  handleSaveChanges(worker.id)
                }
              }}
            />
            <button
              onClick={() => handleSaveChanges(worker.id)}
              className={styles.button}
            >
              {texts.saveButton}
            </button>
            <button
              onClick={() => handleArchive(worker.id, worker.name)}
              className={styles.button}
            >
              {texts.archiveButton}
            </button>
            {worker.isLoggedIn && (
              <button
                onClick={() => handleLogoutOne(worker.id, worker.name)}
                className={styles.button}
              >
                {texts.logoutButton}
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="mass-logout-section">
        <p className={styles.massLogoutText}>
          {texts.massLogoutNote}
        </p>
        <div className={styles.massLogoutContainer}>
          <button onClick={handleLogoutAll} className={styles.button}>
            {texts.massLogoutButton}
          </button>
        </div>
      </div>
      <div className={styles.inactiveToggle}>
        <button
          onClick={() => {
            setShowInactiveWorkers((prev) => !prev);
            if (!showInactiveWorkers) fetchInactiveWorkers();
          }}
          className={styles.button}
        >
          {texts.toggleArchiveButton}
        </button>
      </div>
      {showInactiveWorkers && (
        <div className={styles.inactiveList}>
          <h3>{texts.inactiveWorkers}</h3>
          <ul>
            {inactiveWorkers.map((worker) => (
              <li key={worker.id} className={styles.inactiveItem}>
                {worker.name}
                <button
                  onClick={() => handleReactivate(worker)}
                  className={styles.button}
                >
                  {texts.reactivateButton}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
