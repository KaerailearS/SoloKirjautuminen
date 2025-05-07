import styles from "../styles/Notification.module.css";

const Notification = ({ type, text }) => {
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
