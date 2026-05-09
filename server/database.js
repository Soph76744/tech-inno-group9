const { Sequelize } = require("sequelize");
const path = require("path");
// Creating tools.db using Sequelize
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "tools.db"),
  logging: false
});
// Testing database connection when initialising
// logging result/error
const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Main database connected");
  } catch (error) {
    console.error("Unable to connect to main database:", error);
  }
};

module.exports = {
  sequelize,
  initDB
};