exports.onSuccess = (message, data) => {
  return {
    message,
    data,
    success: true,
  };
};

exports.onError = (status, message) => {
  return {
    status,
    error: true,
    message,
  };
};
