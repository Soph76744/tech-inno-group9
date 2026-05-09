const { DataTypes } = require("sequelize");
const { sequelize } = require("../database");
// Creates a User model for users table in database
// Primary key: username
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "engineer" // or "admin"
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