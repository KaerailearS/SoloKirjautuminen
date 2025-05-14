import React from "react";
import styles from '../styles/LoginCounter.module.css'
import finnish from "../languages/finnish";
import english from "../languages/english";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// login counter keeps track of logins, both over all time, as well as since the last reset. Global count is saved into Firestore in a separate folder, with no other data.
const LoginCounter = ({ triggerUpdateRef, texts }) => {
  const [localCount, setLocalCount] = React.useState(0);
  const [globalCount, setGlobalCount] = React.useState(0);

  const fetchGlobalCount = async () => {
    const counterRef = doc(db, "stats", "logincounter");
    const snapshot = await getDoc(counterRef);
    if (snapshot.exists()) {
      setGlobalCount(snapshot.data().loginCount);
    }
  };

  const incrementCounters = async () => {
    setLocalCount((prev) => prev + 1);

    const counterRef = doc(db, "stats", "logincounter");
    await updateDoc(counterRef, {
      loginCount: increment(1),
    });

    fetchGlobalCount();
  };

  React.useEffect(() => {
    fetchGlobalCount();
    if (triggerUpdateRef) triggerUpdateRef(() => incrementCounters);
  }, []);

  return (
    <div className={styles.loginCounters}>
      <p className={`${styles.counter} ${styles.localCounter}`}>{texts.localCounter}{localCount}</p>
      <p className={`${styles.counter} ${styles.globalCounter}`}>{texts.globalCounter}{globalCount}</p>
    </div>
  );
};
export default LoginCounter;
