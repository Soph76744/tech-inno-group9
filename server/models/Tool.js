const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const Tool = sequelize.define("Tool", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "available" // available, in use, missing
  },
  assigned_to: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_checked: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "tools",
  timestamps: true
});

module.exports = Tool;