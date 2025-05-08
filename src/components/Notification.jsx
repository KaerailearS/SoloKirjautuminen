import styles from "../styles/Notification.module.css";
import finnish from "../languages/finnish";
import english from "../languages/english";

const Notification = ({ type, text, texts }) => {
  const color = {
    success: "green",
    error: "red",
    warning: "orange",
  }[type];
  return (
    <div className={`${styles.notification} ${styles[type]} ${text ? styles.visible : styles.hidden}`}>
      {text && <span>{text}</span>}
    </div>
  );
};

export default Notification;
