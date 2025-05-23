import React from "react";
import styles from "../styles/WorkerList.module.css";
import finnish from "../languages/finnish";
import english from "../languages/english";
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

// container for the main section of the app - sorts worker cards alphabetically, adds all their functionality, as well as updating/saving data into Firestore. Also includes the conditional render for AdminPanel
const WorkerList = ({ texts }) => {
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
        text: `${worker.name}${texts.errorNotification}`,
      });

      setTimeout(() => {
        setErrorMessage(null); // Clears the "already logged in" message
      }, 5000);
      return;
    }

    const now = new Date();
    const late = isLate(now); // comparing time vs 9am
    const minutesLate = getMinutesLate(now); // gets the minutes past 9am, if late
    const minutesToAdd = late ? minutesLate : 0;
    const newTotalLate = worker.totalLateMinutes + minutesToAdd;

    const workerRef = doc(db, "workers", worker.id); // Reference for the specific worker info doc
    await updateDoc(workerRef, {
      isLoggedIn: true, // turns logged in state to true
      late, // state for late vs not late(true / false)
      lastLogin: Timestamp.fromDate(now), // Firebase data for last login, if needed
      totalLateMinutes: newTotalLate, // only adds if late
    });

    const timeStr = now.toLocaleTimeString();
    const totalLateFormatted = formatLateTime(newTotalLate);
    setInfoMessage({
      type: late ? "warning" : "success",
      text: late
        ? texts.loginLate(worker.name, timeStr, minutesLate, totalLateFormatted)
        : texts.loginSuccess(worker.name, timeStr, totalLateFormatted),
    });

    setTimeout(() => setInfoMessage(null), 5000);

    fetchWorkers();

    if (incrementLoginCounter) incrementLoginCounter();
  };

  // function for automatic logout
  const autoLogoutAllWorkers = async () => {
    const snapshot = await getDocs(collection(db, "workers"));
    const batch = [];

    snapshot.forEach((docSnap) => {
      const workerRef = doc(db, "workers", docSnap.id);
      batch.push(updateDoc(workerRef, { isLoggedIn: false, late: false }));
    });
    await Promise.all(batch);
    fetchWorkers();
  };
  // admin mode toggle, reads required hotkey from shortcuts.js
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
  // fetches workers on load
  React.useEffect(() => {
    fetchWorkers();
  }, []);

  // use effect for the automatic logout function, ran at midnight local time
  React.useEffect(() => {
    const now = new Date();
    const millisUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    const timeoutId = setTimeout(() => {
      autoLogoutAllWorkers();
      setInterval(autoLogoutAllWorkers, 24 * 60 * 60 * 1000);
    }, millisUntilMidnight);
    return () => clearTimeout(timeoutId);
  }, []);
  // renders in the login counters, the worker punchcards, notifications and conditionally the admin panel
  return (
    <div>
      <LoginCounter texts={texts} triggerUpdateRef={setIncrementLoginCounter} />
      <div className={styles.workerList}>
        {workers.map((worker) => (
          <WorkerCard
            key={worker.id} // firestore autogenerated ID, bunch of letters & numbers
            name={worker.name} // list is ordered alphabetically based on name
            onLogin={() => handleLogin(worker)} // passes the full worker object into the function
            disabled={worker.isLoggedIn} // disables the button once logged in equals true
            isLoggedIn={worker.isLoggedIn} // basing className on this
            texts={texts}
          />
        ))}
      </div>
      {infoMessage && <Notification texts={texts} {...infoMessage} />}
      {errorMessage && <Notification texts={texts} {...errorMessage} />}
      {adminPanel && (
        <AdminPanel texts={texts} workers={workers} onUpdate={fetchWorkers} />
      )}
    </div>
  );
};

export default WorkerList;
