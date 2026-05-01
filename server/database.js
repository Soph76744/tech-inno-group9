const { Sequelize } = require("sequelize");

const DATABASE_URL = "sqlite:./tools.db";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./tools.db",
  logging: false
});

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  sequelize,
  initDB
};