const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "tools.db"),
  logging: false
});

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Main database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the main database:", error);
  }
};

module.exports = {
  sequelize,
  initDB
};