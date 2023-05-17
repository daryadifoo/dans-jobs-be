const db = require("@root/models");
const jwt = require("jsonwebtoken");
const config = require("@root/config");
const fastify = require("fastify")({ logger: true });

const Service = () => {
  const getUserByUsername = async (username) => {
    const whereClause = {
      username: username,
    };

    const models = await db.custom.FindAll(
      db.db.User,
      whereClause,
      "user",
      false,
      []
    );

    const result = models.map((data) => data.dataValues);
    return result;
  };

  const createUser = async (data) => {
    let result;
    const transaction = await db.db.sequelize.transaction();
    try {
      result = await db.custom.Create(db.db.User, data, transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      fastify.log.info(error);
      return null;
    }
  };

  const verifyToken = async (request, reply) => {
    const query = request.query;
    const { authorization } = request.headers;

    if (!authorization && !query.token) {
      return reply
        .code(403)
        .send({ message: "A token is required for authentication" });
    }

    try {
      const token = authorization
        ? authorization.replace("Bearer ", "")
        : query.token;
      const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
      return decoded;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(401).send({
        message: "Invalid Token",
      });
    }
  };

  return {
    getUserByUsername,
    createUser,
    verifyToken,
  };
};

module.exports = Service;
