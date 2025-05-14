import React from "react";
import styles from '../styles/Clock.module.css'
import finnish from "../languages/finnish";
import english from "../languages/english";

// Clock simply renders in the clock and keeps track of the time
const Clock = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.clock}>
      <h2>{time.toLocaleTimeString()}</h2>
    </div>
  );
};

export default Clock;
