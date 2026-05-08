const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Log = sequelize.define("Log", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  user: {
    type: DataTypes.STRING,
    allowNull: false
  },

  tool_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  fault_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // Flexible logging messages
  message: {
    type: DataTypes.STRING,
    allowNull: true
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false // available, in use, missing
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false // modification, creation, deletion
  }

}, {
  tableName: "logs",
  timestamps: true
});

module.exports = Log;