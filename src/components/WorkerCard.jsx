const WorkerCard = ({ name, onLogin, disabled }) => {
  return <button onClick={() => onLogin(name)}>{name}</button>;
};
export default WorkerCard;
