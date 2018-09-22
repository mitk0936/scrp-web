const run = ({ onStatusChange }) => {
  let currentStatus = null;

  const setStatus = (status) => {
    currentStatus = status;
    onStatusChange(status);
  };

  const getStatus = () => currentStatus;

  return {
    setStatus,
    getStatus
  };
};

module.exports = { run };