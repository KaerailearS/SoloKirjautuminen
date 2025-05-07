import styles from "../styles/WorkerCard.module.css";

const WorkerCard = ({ name, onLogin, disabled, isLoggedIn }) => {
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
