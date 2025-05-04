import React from "react";

const Clock = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock">
      <h2>{time.toLocaleTimeString()}</h2>
    </div>
  );
};

export default Clock;
