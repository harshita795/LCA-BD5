let { sequelize, DataTypes } = require("../lib/index.js");

let Genre = sequelize.define("Genre", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
});

module.exports = Genre;
