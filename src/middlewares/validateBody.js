const { throwSystemError } = require("../services/throwSystemError");

module.exports = {
  validateBody: async (ctx, next) => {
    if (!ctx.request.body || !Object.keys(ctx.request.body).length) {
      throwSystemError("BODY_INVALID", { requestBody: ctx.request.body });
    }
    await next();
  }
};
