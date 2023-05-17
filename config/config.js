require('module-alias/register');
const config = require("@root/config");

module.exports = {
  development: {
    username: config.DB_USER_NAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    host: config.DB_HOST,
    dialect: "postgres",
    logging: false,
    port: config.DB_PORT,
  },
};
