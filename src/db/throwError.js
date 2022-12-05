const mongoose = require("mongoose");
const { throwSystemError } = require("../services/throwSystemError");
const { connectDB } = require("./connectDB");
const { dbErrors } = require("./dbErrors");

const throwError = (error, info) => {
  if (!mongoose.connection.readyState) {
    connectDB();
  }

  const code = error.code || dbErrors.BAD_REQUEST;
  const message = error.errmsg || error.message || error;
  const mongoInfo = {
    _id: error._id,
    code: error.code,
    driver: error.driver,
    name: error.name
  };
  if (code === dbErrors.UNAUTHORIZED) {
    throwSystemError("MONGO_UNAUTHORIZED", {
      replace: { message },
      info,
      mongoInfo
    });
  }
  if (code === dbErrors.CONFLICT) {
    throwSystemError("MONGO_WRITING_ERROR", {
      replace: { message, _id: error._id },
      info,
      mongoInfo
    });
  }
  if (code === dbErrors.BAD_REQUEST) {
    throwSystemError("MONGO_VALIDATION_ERROR", {
      replace: { message },
      info,
      mongoInfo
    });
  }
  if (error.id) {
    throw error;
  }
  throwSystemError("MONGO_ERROR", { replace: { message }, info, mongoInfo });
};
module.exports = { throwError };
