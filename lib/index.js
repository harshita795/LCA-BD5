let sq = require("sequelize");
const path = require("path");

let sequelize = new sq.Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database.sqlite"),
});

module.exports = { DataTypes: sq.DataTypes, sequelize };
