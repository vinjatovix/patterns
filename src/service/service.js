const path = require("path");
const Koa = require("koa");
const cors = require("@koa/cors");
const PUBLIC = require("koa-static")(path.resolve(__dirname, "./public"), {
  index: "index.html"
});
const mount = require("koa-mount");
const koaLogger = require("koa-logger-winston");
const { koaSwagger } = require("koa2-swagger-ui");
const json = require("koa-json");
const bodyParser = require("koa-bodyparser");
const { errorHandler } = require("../middlewares");
const authRouter = require("../api/authentication/router").routes();
const usersRouter = require("../api/users/router").routes();
const logger = require("./logger");
const { Swagger } = require("./swagger");

const service = new Koa();
service
  .use(errorHandler)
  .use(cors())
  .use(koaLogger(logger))
  .use(koaSwagger(Swagger))
  .use(json())
  .use(bodyParser())
  .use(authRouter)
  .use(usersRouter)
  .use(mount("/", PUBLIC));

module.exports = service;
