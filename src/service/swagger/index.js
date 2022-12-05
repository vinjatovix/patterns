const { version, license, name, description, author } = require("../../../package.json");
const { HOST, PORT } = process.env;

const {
  UserSchema,
  UserTag,
  AuthenticationTag,
  loginUser,
  postUser,
  updateUserPassword,
  getCredentials,
  getUsers
} = require("../../api/users/swagger");

const more = {
  name,
  description: "API para control System",
  externalDocs: {
    description: "Find out more",
    url: "https://"
  }
};

const info = {
  title: `${name.toUpperCase()} Back`,
  description,
  termsOfService: "http://swagger.io/terms/",
  contact: {
    email: author
  },
  license: {
    name: license
    // url: ""
  },
  version
};

module.exports = {
  Swagger: {
    routePrefix: "/doc",
    swaggerOptions: {
      spec: {
        openapi: "3.0.1",
        info,
        servers: [{ url: `${HOST}/api/v1` }, { url: `http://${HOST}:${PORT}/api/v1` }],
        security: { bearerAuth: [] },
        tags: [more, AuthenticationTag, UserTag],
        paths: {
          "/authentication/login": loginUser,
          "/credentials": getCredentials,
          "/authentication/signIn": postUser,
          "/authentication/updatePassword": updateUserPassword,
          "/user": getUsers
        },
        components: {
          securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
          },
          schemas: {
            User: UserSchema
          }
        }
      }
    }
  }
};
