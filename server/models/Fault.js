const { DataTypes } = require("sequelize");
const sequelize = require("../faultDatabase");

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
}, {
  timestamps: true
});

module.exports = Fault;