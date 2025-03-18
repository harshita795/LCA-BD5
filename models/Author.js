let { sequelize, DataTypes } = require("../lib/index.js");

let Author = sequelize.define("Author", {
  name: DataTypes.STRING,
  birthdate: DataTypes.DATE,
  email: DataTypes.STRING,
});

module.exports = Author;
