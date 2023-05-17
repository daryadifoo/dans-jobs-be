"use strict";
require("module-alias/register");
const path = require("path");
const AutoLoad = require("@fastify/autoload");
const fastify = require("fastify")({ logger: true });
const config = require("./config");
const cors = require("@fastify/cors");

const start = async () => {
  try {
    await fastify.register(cors, {
      // put your options here
    });
    fastify.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      options: Object.assign({}, config.opts),
    });
    await fastify.listen({ port: config.port, host: config.host });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
