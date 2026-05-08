const { DataTypes } = require("sequelize");
const faultSequelize = require("../faultDatabase");

const Fault = faultSequelize.define(
  "Fault",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FaultName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Severity: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ServiceType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ToolsNeeded: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "faults",
    timestamps: false,
  }
);

module.exports = Fault;
