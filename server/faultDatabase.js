const { Sequelize } = require("sequelize");
const path = require("path");
// Creating faults.db using Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "faults.db"),
  logging: false
});

module.exports = sequelize;