const bcrypt = require("bcrypt");
const { throwSystemError } = require("./throwSystemError");

const encryptPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(12));

const validatePassword = async (password, ref) => {
  if (!(await bcrypt.compare(password, ref))) {
    throwSystemError("INVALID_CREDENTIALS");
  }
};

module.exports = { encryptPassword, validatePassword };
