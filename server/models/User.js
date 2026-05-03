const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_modified: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "users",
  timestamps: false
});

module.exports = User;