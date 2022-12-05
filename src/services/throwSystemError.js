const { errorCodes } = require("./errorCodes");

const throwSystemError = (id, { replace = {}, ...extraInfo } = {}) => {
  const error = errorCodes(replace).find(err => err.id === id);
  throw error;
};

module.exports = {
  throwSystemError
};
