const Notification = ({ type, text }) => {
  const color = {
    success: "green",
    error: "red",
    warning: "orange",
  }[type];
  return (
    <div style={{ border: `1px solid ${color}`, marginTop: 10, padding: 8 }}>
      {text}
    </div>
  );
};

export default Notification;
