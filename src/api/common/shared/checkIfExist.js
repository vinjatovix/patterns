const { throwSystemError } = require("../../../services/throwSystemError");

const checkIfExist = (doc, query, method, modelName) => {
  const id = typeof query === "object" ? Object.values(query)[0] : query;
  if (!doc) throwSystemError("MODEL_NOT_FOUND", { replace: { modelName, id }, method, modelName, id });
};

module.exports = { checkIfExist };
