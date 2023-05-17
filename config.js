// dot env should implement here
require(`dotenv`).config();

module.exports = {
  port: 8080,
  host: "0.0.0.0",
  DB_USER_NAME: process.env.DB_USER_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST_NAME: process.env.DB_HOST_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_TOKEN_KEY: process.env.JWT_TOKEN_KEY,
};
