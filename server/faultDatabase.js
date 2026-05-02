const { Sequelize } = require("sequelize");

const faultSequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./faults.db",
  logging: false
});

module.exports = faultSequelize;