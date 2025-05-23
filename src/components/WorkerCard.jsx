import styles from "../styles/WorkerCard.module.css";
import finnish from "../languages/finnish";
import english from "../languages/english";

// punchcard for each worker, style depending on whether logged in or not
const WorkerCard = ({ name, onLogin, disabled, isLoggedIn, texts }) => {
  const cardClass = `${styles.workerCard} ${
    isLoggedIn ? styles.loggedIn : styles.loggedOut
  }`;
  return (
    <button className={cardClass} onClick={() => onLogin(name)}>
      {name}
    </button>
  );
};
export default WorkerCard;
