const jwt = require("jsonwebtoken");
const { allowedRoles } = require("../../config/cfg.json").system;
const { throwSystemError } = require("./throwSystemError");

const secret = process.env.SECRET;
const expiresIn = +process.env.EXPIRES || 300000;

const createToken = (username, roles) => {
  const payload = { username, roles };
  const token = jwt.sign(payload, secret, { expiresIn });
  return {
    token,
    user: { username, roles }
  };
};

const verifyToken = token => {
  if (!token) {
    throwSystemError("TOKEN_REQUIRED");
  }
  try {
    const user = jwt.verify(token.replace("Bearer ", ""), secret);
    if (!user.roles.some(rol => allowedRoles.includes(rol))) {
      throwSystemError("INVALID_ROLE");
    }
    return {
      username: user.username,
      roles: user.roles
    };
  } catch (error) {
    if (error.code === "E4") throw error;
    throwSystemError("INVALID_TOKEN");
  }
};

const hasRole = (user, role) => {
  if (!user.roles || (user.roles.length && !user.roles.includes(role))) {
    throwSystemError("INVALID_ROLE");
  }
};
const anyRole = user => {
  if (!user.roles.some(rol => allowedRoles.includes(rol))) {
    throwSystemError("INVALID_ROLE");
  }
};

module.exports = {
  createToken,
  verifyToken,
  anyRole,
  isAdmin: user => hasRole(user, "system.admin"),
  isEditor: user => hasRole(user, "system.editor")
};
