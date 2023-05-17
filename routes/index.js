"use strict";

"use strict";
const UserController = require("@root/api/user/controller")({});
const JobController = require("@root/api/job/controller")({});

module.exports = async function (fastify, opts) {
  // User
  fastify.post("/api/user/signup", UserController.signUp);
  fastify.post("/api/user/signin", UserController.signIn);

  // Job
  fastify.get("/api/recruitment/positions", JobController.getPositions);
  fastify.get("/api/recruitment/positions/:id", JobController.getPositionsDetail);
};
