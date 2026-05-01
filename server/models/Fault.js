const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Fault = sequelize.define("Fault", {
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "open"
  }
});

module.exports = Fault;