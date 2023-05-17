const config = require("@root/config");
const fastify = require("fastify")({ logger: true });
const bcrypt = require("bcryptjs");
const UserService = require("./service")({});
const jwt = require("jsonwebtoken");

const Controller = () => {
  const signUp = async (request, reply) => {
    const body = request.body;

    try {
      if (!body || !(body.username && body.password)) {
        return reply.code(403).send({
          message: "username dan password is required",
        });
      }

      // Validate if user exist in database
      const oldUser = await UserService.getUserByUsername(body.username);
      if (oldUser.length > 0) {
        return reply.code(409).send({ status: "User already exist" });
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(body.password, 10);
      const userData = {
        username: body.username,
        password: encryptedPassword,
      };

      await UserService.createUser(userData);

      return reply.code(201).send({
        status: "success",
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({
        status: "error",
      });
    }
  };

  const signIn = async (request, reply) => {
    const body = request.body;

    try {
      // Validate user input
      if (!body || !(body.username && body.password)) {
        return reply
          .code(403)
          .send({ message: "email and password is required" });
      }
      // Validate if user exist in our database
      const user = await UserService.getUserByUsername(body.username);

      if (
        user.length > 0 &&
        (await bcrypt.compare(body.password, user[0].password))
      ) {
        const newUser = {
          ...user[0],
        };
        delete newUser.id;
        delete newUser.password;
        // Create token
        const token = jwt.sign({ ...newUser }, config.JWT_TOKEN_KEY, {
          expiresIn: config.JWT_EXPIRES_IN,
        });

        // save user token
        newUser.accessToken = token;

        // user
        return reply.code(200).send(newUser);
      }
      return reply.code(401).send({ message: "Invalid Credentials" });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({
        status: "error",
      });
    }
  };

  return {
    signUp,
    signIn,
  };
};

module.exports = Controller;
