"use strict";
require("module-alias/register");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const config = require("@root/config");
const db = {};
const fastify = require("fastify")({ logger: true });

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER_NAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: "postgres",
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

async function FindAll(
  model,
  whereClause,
  alias,
  raw,
  include,
  transaction,
  attributes
) {
  let where;
  if (whereClause) {
    let toParse = false;
    for (const key in whereClause) {
      if (whereClause[key] && whereClause[key].constructor == Object) {
        toParse = true;
        break;
      }
    }
    if (toParse == true) where = whereClause;
    else where = JSON.parse(JSON.stringify(whereClause));
  }

  let data = [];
  try {
    const temps = await model.findAll({
      attributes,
      raw,
      as: alias,
      where,
      include,
      transaction,
    });
    data = [...temps];
  } catch (error) {
    fastify.log.error(error);
  }

  return data;
}

async function Create(model, data, transaction) {
  let result;
  try {
    result = await model.create(data, { transaction });
  } catch (error) {
    throw new ErrorHandler(500, error);
  }
  return result;
}

module.exports = {
  db,
  custom: {
    FindAll,
    Create,
  },
};
