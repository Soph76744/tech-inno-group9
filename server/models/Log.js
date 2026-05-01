const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Log = sequelize.define("Log", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tool_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false // available, in use, missing
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "logs",
  timestamps: true
});

module.exports = Log;