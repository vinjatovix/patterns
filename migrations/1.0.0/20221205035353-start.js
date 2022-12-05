const { createMetadata } = require("../../src/api/common/shared");
const logger = require("../../src/service/logger");
const { encryptPassword } = require("../../src/services/passwordEncryption");
const roles = require("../../config/cfg.json").system.allowedRoles;

module.exports = {
  async up(db) {
    const time = +new Date();
    await db.collection("users").insertOne({
      username: process.env.ADMIN_USERNAME,
      password: encryptPassword(process.env.ADMIN_PASSWORD),
      roles,
      metadata: createMetadata("GOD")
    });

    logger.info(`Migration "start" finished in ${+new Date() - time}ms`);
  }
};
