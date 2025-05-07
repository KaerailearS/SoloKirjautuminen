import React from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import WorkerCard from "./WorkerCard";
import Notification from "./Notification";
import { isLate, getMinutesLate } from "../utils/timeUtils";
import AdminPanel from "./AdminPanel";
import LoginCounter from "./LoginCounter";
import SHORTCUT_KEYS from "../config/shortcuts";
import { formatLateTime } from "../utils/timeUtils";

const WorkerList = () => {
  const [workers, setWorkers] = React.useState([]); // store Firebase / Firestore based worker data in state
  const [infoMessage, setInfoMessage] = React.useState(null); // informational message - success, late
  const [errorMessage, setErrorMessage] = React.useState(null); // error message for repeated login attempts
  const [adminPanel, setAdminPanel] = React.useState(false); // admin mode
  const [incrementLoginCounter, setIncrementLoginCounter] =
    React.useState(null);

  // fetch worker data from Firestore
  const fetchWorkers = async () => {
    const snapshot = await getDocs(collection(db, "workers"));
    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    result.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
    setWorkers(result);
  };
  // function for the buttons handling clicky click
  const handleLogin = async (worker) => {
    if (worker.isLoggedIn) {
      setErrorMessage({
        type: "error",
        text: `${worker.name} is already logged in.`,
      });

      setTimeout(() => {
        setErrorMessage(null); // Clears the "already logged in" message
      }, 5000);
      return;
    }

    const now = new Date();
    const late = isLate(now); // comparing time vs 9am
    const minutesLate = getMinutesLate(now); // gets the minutes past 9am, if late

    const workerRef = doc(db, "workers", worker.id); // Reference for the specific worker info doc
    await updateDoc(workerRef, {
      isLoggedIn: true, // turns logged in state to true
      late, // state for late vs not late(true / false)
      lastLogin: Timestamp.fromDate(now), // Firebase data for last login, if needed
      totalLateMinutes: worker.totalLateMinutes + (late ? minutesLate : 0), // only adds if late
    });

    setInfoMessage({
      type: late ? "warning" : "success",
      text: `${worker.name} logged in at ${now.toLocaleTimeString()}${
        late ? ` — ${minutesLate} minutes late!` : "On time!"
      } Total late: ${formatLateTime(worker.totalLateMinutes)}`,
    });

    setTimeout(() => setInfoMessage(null), 5000);

    fetchWorkers();

    if (incrementLoginCounter) incrementLoginCounter();
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const shortcut = SHORTCUT_KEYS.ADMIN_PANEL_TOGGLE;
      const match =
        e.code === shortcut.code &&
        e.ctrlKey === !!shortcut.ctrlKey &&
        e.shiftKey === !!shortcut.shiftKey &&
        e.altKey === !!shortcut.altKey;

      if (match) {
        e.preventDefault();
        setAdminPanel((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  React.useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div>
      {workers.map((worker) => (
        <WorkerCard
          key={worker.id}
          name={worker.name}
          onLogin={() => handleLogin(worker)} // passes the full worker object into the function
          disabled={worker.isLoggedIn} // disables the button once logged in equals true
        />
      ))}
      {adminPanel && <AdminPanel workers={workers} onUpdate={fetchWorkers} />}
      {infoMessage && <Notification {...infoMessage} />}
      {errorMessage && <Notification {...errorMessage} />}
      <LoginCounter triggerUpdateRef={setIncrementLoginCounter} />
    </div>
  );
};

export default WorkerList;
