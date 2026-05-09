const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
// Creates a Logs model for logs table in database
// Primary key: id

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    tool_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "logs",
    timestamps: true,
  }
);

module.exports = Log;